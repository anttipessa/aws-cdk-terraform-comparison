package test

import (
	"testing"
	"time"

	http_helper "github.com/gruntwork-io/terratest/modules/http-helper"

	"github.com/gruntwork-io/terratest/modules/terraform"
)

// *
// * This tests the Terraform module in modules/serverless-backend using Terratest.
// * This module deploys a serverless backend with an API Gateway endpoint and a DynamoDB table.
// * The test will send a message to the API Gateway endpoint and then check that the message is in the DynamoDB table.
// *
func TestServerlessBackend(t *testing.T) {
	t.Parallel()

	terraformDir := "../modules/serverless-backend"
	awsRegion := "eu-west-1"

	terraformOptions := terraform.WithDefaultRetryableErrors(t, &terraform.Options{
		TerraformDir: terraformDir,

		// Variables to pass to our Terraform code using -var options
		Vars: map[string]interface{}{
			"region":     awsRegion,
			"table_name": "MessagesTable",
		},
	})

	// At the end of the test, run `terraform destroy` to clean up any resources that were created
	defer terraform.Destroy(t, terraformOptions)

	// This will run `terraform init` and `terraform apply` and fail the test if there are any errors
	terraform.InitAndApply(t, terraformOptions)

	// Check apigateway endpoint is available -> lambda function is deployed -> dynamodb table is created

	url := terraform.Output(t, terraformOptions, "api_gateway_endpoint")
	url = url + "/messages"
	expectedStatus := 200
	expectedBody := "[]"
	maxRetries := 10
	timeBetweenRetries := 3 * time.Second
	http_helper.HttpGetWithRetry(t, url, nil, expectedStatus, expectedBody, maxRetries, timeBetweenRetries)

	// Send a message to the API Gateway endpoint

	messagePayload := "{\"date\": \"2023-03-27T13:00:10.729Z\",\"message\": \"Test\",\"sender\": \"Testsender\",\"type\": \"message\"}"
	headers := map[string]string{"Content-Type": "application/json"}

	http_helper.HTTPDoWithRetry(t, "POST", url, []byte(messagePayload), headers, expectedStatus, maxRetries, timeBetweenRetries, nil)

	// Check that there is one message in the DynamoDB table

	expectedBody = "[{\"message\":\"Test\",\"date\":\"2023-03-27T13:00:10.729Z\",\"sender\":\"Testsender\"}]"

	http_helper.HttpGetWithRetry(t, url, nil, expectedStatus, expectedBody, maxRetries, timeBetweenRetries)

}
