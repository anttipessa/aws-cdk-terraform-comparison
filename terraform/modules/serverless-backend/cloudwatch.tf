resource "aws_cloudwatch_log_group" "api_gateway_access_logs" {
  name              = "/aws/apigateway/messagesApi"
  retention_in_days = 1
}

resource "aws_cloudwatch_log_group" "get_lambda_access_logs" {
  name              = "/aws/lambda/messagesApi/getFunction"
  retention_in_days = 1
}

resource "aws_cloudwatch_log_group" "post_lambda_access_logs" {
  name              = "/aws/lambda/messagesApi/postFunction"
  retention_in_days = 1
}
