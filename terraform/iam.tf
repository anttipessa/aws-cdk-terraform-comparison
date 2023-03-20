data "aws_iam_user" "user" {
  user_name = "github-user"
}

resource "aws_iam_policy" "ci_policy" {
  name        = "github-ci-policy"
  path        = "/"
  description = "GitHub CI policy"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "s3:PutObject",
          "s3:PutObjectAcl",
          "s3:DeleteObject"
        ],
        Effect = "Allow",
        Resource = [
          "${aws_s3_bucket.static_react_bucket.arn}/*"
        ]
      },
      {
        Action = [
          "s3:ListBucket"
        ],
        Effect = "Allow",
        Resource = [
          aws_s3_bucket.static_react_bucket.arn
        ]
      },
    ]
  })
}

# Attach full cloudfront access to the policy
resource "aws_iam_policy" "ci_cloudfront_policy" {
  name        = "github-ci-cloudfront-policy"
  path        = "/"
  description = "GitHub CI cloudfront policy"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "cloudfront:CreateInvalidation",
          "cloudfront:GetDistribution",
          "cloudfront:GetDistributionConfig",
          "cloudfront:ListDistributions",
          "cloudfront:ListInvalidations",
          "cloudfront:UpdateDistribution",
          "cloudfront:UpdateDistributionConfig"
        ],
        Effect = "Allow",
        Resource = [
          "*"
        ]
      },
    ]
  })
}

resource "aws_iam_policy_attachment" "s3_attachment" {
  name       = "github-ci-attachment"
  users      = [data.aws_iam_user.user.user_name]
  policy_arn = aws_iam_policy.ci_policy.arn
}

resource "aws_iam_policy_attachment" "cloudfront_attachment" {
  name       = "github-ci-attachment"
  users      = [data.aws_iam_user.user.user_name]
  policy_arn = aws_iam_policy.ci_cloudfront_policy.arn
}