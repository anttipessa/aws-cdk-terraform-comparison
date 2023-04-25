# Terraform

## Requirements
The following tools are required to run the terraform code in this repository:
- Terraform (version: v1.3.9)
- AWS CLI (version: 2.11.0)

## Environments
environments folder contains the terraform code for each environment. The environments are:
- dev
- prod
- staging

They can be deployed with the run.sh script in the root of the terraform folder. For example to deploy the dev environment run:

```./run.sh dev apply --auto-approve```

## Modules
The modules folder contains the terraform code for the modules. The modules are:
- static-site
- serverless-backend

## Testing
The tests folder contains the terratest code for the modules. The tests are written with Terratest. See test/README.md for more information.

## TFLint
TFLint is used to lint the terraform code. The configuration is in the .tflint.hcl file in the root of the terraform folder. Run command to lint the code:

```tflint --format compact --recursive --config .tflint.hcl```