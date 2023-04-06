resource "aws_apigatewayv2_api" "messages_api" {
  name          = "MessagesApi"
  protocol_type = "HTTP"
  cors_configuration {
    allow_origins = ["*"]
    allow_methods = ["GET", "POST"]
    allow_headers = ["Content-Type"]
  }
}

resource "aws_apigatewayv2_route" "messages_route" {
  api_id    = aws_apigatewayv2_api.messages_api.id
  route_key = "GET /messages"
  target    = "integrations/${aws_apigatewayv2_integration.messages_integration_get.id}"
}

resource "aws_apigatewayv2_route" "messages_route_post" {
  api_id    = aws_apigatewayv2_api.messages_api.id
  route_key = "POST /messages"
  target    = "integrations/${aws_apigatewayv2_integration.messages_integration_post.id}"
}

resource "aws_apigatewayv2_integration" "messages_integration_get" {
  api_id                 = aws_apigatewayv2_api.messages_api.id
  integration_type       = "AWS_PROXY"
  integration_method     = "POST"
  payload_format_version = "2.0"
  connection_type        = "INTERNET"
  description            = "readFunction"
  timeout_milliseconds   = 29000
  integration_uri        = aws_lambda_function.read_function.invoke_arn
  passthrough_behavior   = "WHEN_NO_MATCH"
}

resource "aws_apigatewayv2_integration" "messages_integration_post" {
  api_id                 = aws_apigatewayv2_api.messages_api.id
  integration_type       = "AWS_PROXY"
  integration_method     = "POST"
  payload_format_version = "2.0"
  connection_type        = "INTERNET"
  description            = "writeFunction"
  timeout_milliseconds   = 29000
  integration_uri        = aws_lambda_function.write_function.invoke_arn
  passthrough_behavior   = "WHEN_NO_MATCH"
}

resource "aws_apigatewayv2_stage" "messages_stage" {
  api_id = aws_apigatewayv2_api.messages_api.id
  name   = "$default"

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.api_gateway_access_logs.arn
    format          = jsonencode({ "requestId" : "$context.requestId", "ip" : "$context.identity.sourceIp", "requestTime" : "$context.requestTime", "httpMethod" : "$context.httpMethod", "routeKey" : "$context.routeKey", "status" : "$context.status", "protocol" : "$context.protocol", "responseLength" : "$context.responseLength" })
  }
  auto_deploy = true
}

resource "aws_apigatewayv2_deployment" "messages_deployment" {
  api_id = aws_apigatewayv2_api.messages_api.id

  lifecycle {
    create_before_destroy = true
  }
  depends_on = [aws_apigatewayv2_integration.messages_integration_get,
  aws_apigatewayv2_integration.messages_integration_post]

}
