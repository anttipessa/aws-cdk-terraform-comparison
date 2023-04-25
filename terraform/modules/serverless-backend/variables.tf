# Input variable definitions

variable "table_name" {
  description = "Name of the dynamodb table. Must be unique."
  type        = string
}

variable "table_tags" {
  description = "Tags to set on the table."
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

variable "lambda_memory_size" {
  description = "The amount of memory to allocate to the lambda function"
  type        = number
  default     = 128
}