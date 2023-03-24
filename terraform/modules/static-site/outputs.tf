# Output variable definitions

output "bucket_arn" {
  description = "ARN of the bucket"
  value       = aws_s3_bucket.static_react_bucket.arn
}

output "bucket_name" {
  description = "Name (id) of the bucket"
  value       = aws_s3_bucket.static_react_bucket.arn
}

output "cf_name" {
  description = "Domain name of cloudfront"
  value       = aws_cloudfront_distribution.cf_distribution.domain_name
}

output "cf_arn" {
  description = "Arn of cloudfront"
  value       = aws_cloudfront_distribution.cf_distribution.arn
}