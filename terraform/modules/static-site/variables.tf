# Input variable definitions

variable "bucket_name" {
  description = "Name of the s3 bucket. Must be unique."
  type        = string
}

variable "tags" {
  description = "Tags to set on the bucket."
  type        = map(string)
  default     = {}
}

variable "region" {
  description = "The AWS region to deploy to"
  type        = string
}

variable "env" {
  description = "environment name"
  type        = string
}