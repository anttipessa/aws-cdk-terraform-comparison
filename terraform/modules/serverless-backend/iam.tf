data "aws_iam_policy_document" "assume_role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "iam_for_lambda_read" {
  name               = "iam_for_lambda_read"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}

resource "aws_iam_role" "iam_for_lambda_write" {
  name               = "iam_for_lambda_write"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}

resource "aws_iam_role_policy_attachment" "read_lambda_policy_attachment" {
  role       = aws_iam_role.iam_for_lambda_read.name
  policy_arn = aws_iam_policy.read_dynamodb_policy.arn
}

resource "aws_iam_role_policy_attachment" "logging_read_lambda_policy_attachment" {
  role       = aws_iam_role.iam_for_lambda_read.name
  policy_arn = aws_iam_policy.function_logging_policy.arn
}

resource "aws_iam_role_policy_attachment" "write_lambda_policy_attachment" {
  role       = aws_iam_role.iam_for_lambda_write.name
  policy_arn = aws_iam_policy.write_dynamodb_policy.arn
}

resource "aws_iam_role_policy_attachment" "logging_write_lambda_policy_attachment" {
  role       = aws_iam_role.iam_for_lambda_write.name
  policy_arn = aws_iam_policy.function_logging_policy.arn
}

resource "aws_iam_policy" "function_logging_policy" {
  name = "function-logging-policy"
  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        Action : [
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ],
        Effect : "Allow",
        Resource : "arn:aws:logs:*:*:*"
      }
    ]
  })
}

resource "aws_iam_policy" "read_dynamodb_policy" {
  name = "read_dynamodb_policy"

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

resource "aws_iam_policy" "write_dynamodb_policy" {
  name = "write_dynamodb_policy"

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
