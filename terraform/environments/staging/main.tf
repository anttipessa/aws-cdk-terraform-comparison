terraform {
  backend "s3" {
    bucket = "aws-s3-terraform-state"
    key    = "state/staging/terraform.tfstate"
    region = "eu-west-1"
  }
}

module "static_site" {
  source      = "../../modules/static-site"
  bucket_name = "react-bucket-hosted-aws-s3-terraform-staging"
  region      = var.region
  tags = {
    Terraform   = "true"
    Environment = "staging"
  }
  env = "staging"
}

module "serverless_backend" {
  source     = "../../modules/serverless-backend"
  table_name = "MessagesTableStaging"
  region     = var.region
  table_tags = {
    name = "Staging"
  }
  env = "staging"
}

