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

resource "aws_iam_role_policy_attachment" "dynamoDBLambdaReadPolicyAttachment" {
  role       = aws_iam_role.iam_for_lambda_read.name
  policy_arn = aws_iam_policy.dynamoDBLambdaReadPolicy.arn
}

resource "aws_iam_role_policy_attachment" "dynamoDBLambdaWritePolicyAttachment" {
  role       = aws_iam_role.iam_for_lambda_write.name
  policy_arn = aws_iam_policy.dynamoDBLambdaWritePolicy.arn
}