output "s3_bucket_name" {
  description = "The name of the created S3 bucket"
  value       = aws_s3_bucket.shopsmart_bucket.bucket
}

output "ecr_repository_url" {
  description = "The URL of the ECR repository (Backend)"
  value       = aws_ecr_repository.shopsmart_backend.repository_url
}

output "frontend_ecr_url" {
  description = "The URL of the ECR repository (Frontend)"
  value       = aws_ecr_repository.shopsmart_frontend.repository_url
}

output "ecs_cluster_name" {
  description = "The name of the ECS cluster"
  value       = aws_ecs_cluster.main.name
}

output "ecs_service_name" {
  description = "The name of the ECS service (Backend)"
  value       = aws_ecs_service.main.name
}

output "frontend_service_name" {
  description = "The name of the ECS service (Frontend)"
  value       = aws_ecs_service.frontend.name
}

output "alb_dns_name" {
  description = "The DNS name of the Application Load Balancer"
  value       = aws_lb.main.dns_name
}
