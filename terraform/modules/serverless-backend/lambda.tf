
data "archive_file" "lambda" {
  type        = "zip"
  source_dir  = "${path.module}/dist"
  output_path = "${path.module}/dist/lambda.zip"
}

resource "aws_lambda_function" "read_function" {
  filename      = data.archive_file.lambda.output_path
  function_name = "readFunction"
  role          = aws_iam_role.iam_for_lambda_read.arn
  handler       = "readFunction.handler"
  architectures = ["arm64"]
  runtime       = "nodejs14.x"
  source_code_hash = data.archive_file.lambda.output_base64sha256
}

resource "aws_lambda_function" "write_function" {
  filename      = data.archive_file.lambda.output_path
  function_name = "writeFunction"
  role          = aws_iam_role.iam_for_lambda_write.arn
  handler       = "writeFunction.handler"
  architectures = ["arm64"]
  runtime       = "nodejs14.x"
  source_code_hash = data.archive_file.lambda.output_base64sha256
}

resource "aws_lambda_permission" "allow_api_gateway_read" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.read_function.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.messages_api.execution_arn}/*"
}

resource "aws_lambda_permission" "allow_api_gateway_write" {
  statement_id  = "AllowExecutionFromAPIGateway2"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.write_function.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.messages_api.execution_arn}/*"
}

