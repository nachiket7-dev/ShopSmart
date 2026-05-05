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
  default     = "shopsmart-state-nm-final-987"
}

variable "container_port" {
  description = "The port the container listens on"
  type        = number
  default     = 3000
}

variable "mongodb_uri" {
  description = "MongoDB connection string"
  type        = string
  sensitive   = true
}

variable "jwt_secret" {
  description = "Secret key for JWT"
  type        = string
  sensitive   = true
}
