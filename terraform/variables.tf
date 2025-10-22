variable "aws_region" {
  description = "AWS region"
  default     = "us-east-1"
}

variable "ec2_key_name" {
  description = "EC2 Key Pair name (not .pem path)"
  type        = string
}

variable "db_username" {
  description = "RDS MySQL username"
  type        = string
}

variable "db_password" {
  description = "RDS MySQL password"
  type        = string
}

variable "repo_url" {
  description = "GitLab repository URL"
  type        = string
}

variable "app_key" {
  description = "App key"
  type = string
}
