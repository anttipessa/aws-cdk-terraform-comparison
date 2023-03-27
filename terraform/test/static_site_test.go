package test

import (
	"fmt"
	"strings"
	"testing"

	"github.com/gruntwork-io/terratest/modules/aws"
	"github.com/gruntwork-io/terratest/modules/random"
	"github.com/gruntwork-io/terratest/modules/terraform"
	"github.com/stretchr/testify/assert"
)

// *
// * This tests the Terraform module in modules/static-site using Terratest.
// * This module deploys a static website to an S3 bucket with versioning and a policy attached.
// * The test will check that the S3 bucket has versioning enabled and a policy attached.
// *
func TestStaticSite(t *testing.T) {

	t.Parallel()

	expectedName := fmt.Sprintf("terratest-aws-static-site-%s", strings.ToLower(random.UniqueId()))
	awsRegion := "eu-west-1"

	terraformDir := "../modules/static-site"

	// Setup the Terraform options with default retryable errors to handle the most common retryable errors in Terraform testing.

	terraformOptions := terraform.WithDefaultRetryableErrors(t, &terraform.Options{

		// The path to where our Terraform code is located

		TerraformDir: terraformDir,
		Vars: map[string]interface{}{
			"bucket_name": expectedName,
			"tags": map[string]string{
				"Environment": "Test",
				"Name":        "Terraform Test",
			},
			"region": awsRegion,
		},
	})

	// At the end of the test, run `terraform destroy` to clean up any resources that were created

	defer terraform.Destroy(t, terraformOptions)

	// This will run `terraform init` and `terraform apply` and fail the test if there are any errors

	terraform.InitAndApply(t, terraformOptions)

	// Run `terraform output` to get the value of an output variable

	bucketName := terraform.Output(t, terraformOptions, "bucket_name")

	// Verify we're getting back the outputs we expect

	assert.Equal(t, expectedName, bucketName)

	// Run `terraform output` to get the value of an output variable
	bucketID := terraform.Output(t, terraformOptions, "bucket_id")

	// Verify that our Bucket has versioning enabled
	actualStatus := aws.GetS3BucketVersioning(t, awsRegion, bucketID)
	expectedStatus := "Enabled"
	assert.Equal(t, expectedStatus, actualStatus)

	// Verify that our Bucket has a policy attached
	aws.AssertS3BucketPolicyExists(t, awsRegion, bucketID)

}
