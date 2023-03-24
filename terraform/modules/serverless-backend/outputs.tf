# Output variable definitions

output "table_name" {
  description = "Name of the dynamodb table"
  value       = aws_dynamodb_table.messages_table.name
}

output "table_arn" {
  description = "Arn of the dynamodb table"
  value       = aws_dynamodb_table.messages_table.arn
}

output "api_gateway_endpoint" {
  description = "Endpoint of the api gateway"
  value       = aws_apigatewayv2_api.messages_api.api_endpoint
}
