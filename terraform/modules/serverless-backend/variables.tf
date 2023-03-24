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
