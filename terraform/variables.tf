variable "aws_region" {
  description = "The AWS region to deploy into"
  type        = string
  default     = "us-east-1"
}

variable "app_name" {
  description = "The name of the application"
  type        = string
  default     = "shopsmart"
}

variable "s3_bucket_name" {
  description = "The name of the S3 bucket (must be globally unique)"
  type        = string
  default     = "shopsmart-terraform-state-nm123987"
}

variable "container_port" {
  description = "The port the container listens on"
  type        = number
  default     = 3000
}
