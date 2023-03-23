resource "aws_dynamodb_table" "messages_table" {
  name         = "MessagesTable"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "pk"
  range_key    = "sk"

  attribute {
    name = "pk"
    type = "S"
  }

  attribute {
    name = "sk"
    type = "S"
  }

  tags = {
    Name = "MessagesTable"
  }
}

resource "aws_iam_policy" "dynamoDBLambdaReadPolicy" {
  name = "DynamoDBLambdaPolicy"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "dynamodb:Query",
        ]
        Resource = [
          aws_dynamodb_table.messages_table.arn
        ]
      }
    ]
  })
}

resource "aws_iam_policy" "dynamoDBLambdaWritePolicy" {
  name = "DynamoDBLambdaWritePolicy"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "dynamodb:PutItem",
        ]
        Resource = [
          aws_dynamodb_table.messages_table.arn
        ]
      }
    ]
  })
}