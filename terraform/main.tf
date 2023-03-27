terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.58.0"
    }
  }

  required_version = ">= 1.2.0"
}

provider "aws" {
  region = var.region
}

module "static_site" {
  source      = "./modules/static-site"
  bucket_name = "react-bucket-hosted-aws-s3-terraform"
  region = var.region
  tags = {
    Terraform   = "true"
    Environment = "dev"
  }
}

module "serverless_backend" {
  source     = "./modules/serverless-backend"
  table_name = "MessagesTable"
  region = var.region
  table_tags = {
    name = "MessagesTable"
  }
}
