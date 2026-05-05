provider "aws" {
  region = var.aws_region
}

# ---------------------------------------------------------
# S3 Bucket Configuration (Rubric Requirement)
# ---------------------------------------------------------

resource "random_string" "suffix" {
  length  = 6
  special = false
  upper   = false
}

resource "aws_s3_bucket" "shopsmart_bucket" {
  bucket        = "${var.s3_bucket_name}-${random_string.suffix.result}"
  force_destroy = true # Useful for cleanup in student projects
}

# Versioning enabled
resource "aws_s3_bucket_versioning" "shopsmart_bucket_versioning" {
  bucket = aws_s3_bucket.shopsmart_bucket.id
  versioning_configuration {
    status = "Enabled"
  }
}

# Encryption enabled (AES256)
resource "aws_s3_bucket_server_side_encryption_configuration" "shopsmart_bucket_encryption" {
  bucket = aws_s3_bucket.shopsmart_bucket.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# Public access blocked
resource "aws_s3_bucket_public_access_block" "shopsmart_bucket_public_access_block" {
  bucket = aws_s3_bucket.shopsmart_bucket.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# ---------------------------------------------------------
# ECR Repository
# ---------------------------------------------------------

resource "aws_ecr_repository" "shopsmart_backend" {
  name                 = "shopsmart-backend-${random_string.suffix.result}"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}

resource "aws_ecr_repository" "shopsmart_frontend" {
  name                 = "shopsmart-frontend-${random_string.suffix.result}"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}

# ---------------------------------------------------------
# Networking (Using Default VPC to bypass VpcLimitExceeded)
# ---------------------------------------------------------

data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

# ---------------------------------------------------------
# Security Groups
# ---------------------------------------------------------

resource "aws_security_group" "alb_sg" {
  name        = "${var.app_name}-alb-sg-${random_string.suffix.result}"
  description = "Allow inbound HTTP traffic to ALB"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "ecs_sg" {
  name        = "${var.app_name}-ecs-tasks-sg-${random_string.suffix.result}"
  description = "Allow inbound traffic from ALB only"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    from_port       = var.container_port
    to_port         = var.container_port
    protocol        = "tcp"
    security_groups = [aws_security_group.alb_sg.id]
  }

  ingress {
    from_port       = 8080
    to_port         = 8080
    protocol        = "tcp"
    security_groups = [aws_security_group.alb_sg.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# ---------------------------------------------------------
# Application Load Balancer
# ---------------------------------------------------------

resource "aws_lb" "main" {
  name               = "shopsmart-alb-${random_string.suffix.result}"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb_sg.id]
  subnets            = data.aws_subnets.default.ids
}

resource "aws_lb_target_group" "app" {
  name        = "shopsmart-tg-${random_string.suffix.result}"
  port        = var.container_port
  protocol    = "HTTP"
  vpc_id      = data.aws_vpc.default.id
  target_type = "ip"

  health_check {
    healthy_threshold   = "2"
    unhealthy_threshold = "10"
    timeout             = "10"
    interval            = "45"
    path                = "/api/health"
    matcher             = "200"
  }
}

resource "aws_lb_target_group" "frontend" {
  name        = "shopsmart-fe-tg-${random_string.suffix.result}"
  port        = 8080
  protocol    = "HTTP"
  vpc_id      = data.aws_vpc.default.id
  target_type = "ip"

  health_check {
    healthy_threshold   = "2"
    unhealthy_threshold = "10"
    timeout             = "10"
    interval            = "45"
    path                = "/"
    matcher             = "200"
  }
}

resource "aws_lb_listener" "front_end" {
  load_balancer_arn = aws_lb.main.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.frontend.arn
  }
}

resource "aws_lb_listener_rule" "backend_api" {
  listener_arn = aws_lb_listener.front_end.arn
  priority     = 100

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.app.arn
  }

  condition {
    path_pattern {
      values = ["/api/*"]
    }
  }
}

# ---------------------------------------------------------
# ECS Cluster and Fargate Service
# ---------------------------------------------------------

resource "aws_ecs_cluster" "main" {
  name = "${var.app_name}-cluster-${random_string.suffix.result}"
}

# Get current AWS account ID (sts:GetCallerIdentity is always allowed)
data "aws_caller_identity" "current" {}

# Build the LabRole ARN directly — avoids iam:GetRole which Learner Lab blocks
locals {
  lab_role_arn = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/LabRole"
}

resource "aws_ecs_task_definition" "app" {
  family                   = "${var.app_name}-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "512"
  memory                   = "1024"
  execution_role_arn       = local.lab_role_arn
  task_role_arn            = local.lab_role_arn

  container_definitions = jsonencode([{
    name      = "${var.app_name}-container"
    image     = "${aws_ecr_repository.shopsmart_backend.repository_url}:latest"
    essential = true
    portMappings = [{
      protocol      = "tcp"
      containerPort = var.container_port
      hostPort      = var.container_port
    }]
    environment = [
      { name = "MONGODB_URI", value = var.mongodb_uri },
      { name = "JWT_SECRET", value = var.jwt_secret },
      { name = "PORT", value = tostring(var.container_port) }
    ]
    logConfiguration = {
      logDriver = "awslogs"
      options = {
        "awslogs-group"         = "/ecs/${var.app_name}-${random_string.suffix.result}"
        "awslogs-region"        = var.aws_region
        "awslogs-stream-prefix" = "ecs"
      }
    }
  }])
}

resource "aws_cloudwatch_log_group" "ecs_log_group" {
  name              = "/ecs/${var.app_name}-${random_string.suffix.result}"
  retention_in_days = 7
}

resource "aws_ecs_service" "main" {
  name            = "${var.app_name}-service-${random_string.suffix.result}"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.app.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    security_groups  = [aws_security_group.ecs_sg.id]
    subnets          = data.aws_subnets.default.ids
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.app.arn
    container_name   = "${var.app_name}-container"
    container_port   = var.container_port
  }

  depends_on = [aws_lb_listener.front_end]
}

resource "aws_ecs_task_definition" "frontend" {
  family                   = "${var.app_name}-frontend-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "512"
  memory                   = "1024"
  execution_role_arn       = local.lab_role_arn
  task_role_arn            = local.lab_role_arn

  container_definitions = jsonencode([{
    name      = "${var.app_name}-frontend-container"
    image     = "${aws_ecr_repository.shopsmart_frontend.repository_url}:latest"
    essential = true
    portMappings = [{
      protocol      = "tcp"
      containerPort = 8080
      hostPort      = 8080
    }]
    logConfiguration = {
      logDriver = "awslogs"
      options = {
        "awslogs-group"         = "/ecs/${var.app_name}-frontend-${random_string.suffix.result}"
        "awslogs-region"        = var.aws_region
        "awslogs-stream-prefix" = "ecs"
      }
    }
  }])
}

resource "aws_cloudwatch_log_group" "ecs_log_group_frontend" {
  name              = "/ecs/${var.app_name}-frontend-${random_string.suffix.result}"
  retention_in_days = 7
}

resource "aws_ecs_service" "frontend" {
  name            = "${var.app_name}-frontend-service-${random_string.suffix.result}"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.frontend.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    security_groups  = [aws_security_group.ecs_sg.id]
    subnets          = data.aws_subnets.default.ids
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.frontend.arn
    container_name   = "${var.app_name}-frontend-container"
    container_port   = 8080
  }

  depends_on = [aws_lb_listener.front_end]
}
