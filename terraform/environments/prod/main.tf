terraform {
  backend "s3" {
    bucket = "aws-s3-terraform-state"
    key    = "state/prod/terraform.tfstate"
    region = "eu-west-1"
  }
}

module "static_site" {
  source      = "../../modules/static-site"
  bucket_name = "react-bucket-hosted-aws-s3-terraform-prod"
  region      = var.region
  tags = {
    Terraform   = "true"
    Environment = "prod"
  }
  env = "prod"
}

module "serverless_backend" {
  source     = "../../modules/serverless-backend"
  table_name = "MessagesTableProd"
  region     = var.region
  table_tags = {
    name = "MessagesTableProd"
  }
  env = "prod"
  lambda_memory_size = 512
}

