terraform {
  backend "s3" {
    bucket = "aws-s3-terraform-state"
    key    = "state/dev/terraform.tfstate"
    region = "eu-west-1"
  }
}

module "static_site" {
  source      = "../../modules/static-site"
  bucket_name = "react-bucket-hosted-aws-s3-terraform-dev"
  region      = var.region
  tags = {
    Terraform   = "true"
    Environment = "dev"
  }
  env = "dev"
}

module "serverless_backend" {
  source     = "../../modules/serverless-backend"
  table_name = "MessagesTableDev"
  region     = var.region
  table_tags = {
    name = "MessagesTable"
  }
  env = "dev"
}