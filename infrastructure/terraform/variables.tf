variable "aws_region" {
  description = "AWS region where Deepak Store infrastructure will be deployed."
  type        = string
  default     = "ap-south-1"
}

variable "environment" {
  description = "Deployment environment."
  type        = string
  default     = "dev"
}
