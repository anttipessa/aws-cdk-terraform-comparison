# Output variable definitions

output "website_bucket_arn" {
  description = "ARN of the bucket"
  value       = module.static_site.bucket_arn
}

output "website_bucket_name" {
  description = "Name (id) of the bucket"
  value       = module.static_site.bucket_name
}

output "website_cf_name" {
  description = "Name of the cloudfront"
  value       = module.static_site.cf_name
}

output "website_cf_arn" {
  description = "Arn of cloudfront"
  value       = module.static_site.cf_arn
}

output "api_gateway_endpoint" {
  description = "Endpoint of the api gateway"
  value       = module.serverless_backend.api_gateway_endpoint
}