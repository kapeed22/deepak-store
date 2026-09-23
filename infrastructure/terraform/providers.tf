provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "deepak-store"
      Environment = var.environment
      ManagedBy   = "terraform"
    }
  }
}
