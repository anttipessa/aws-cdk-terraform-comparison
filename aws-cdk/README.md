# CDK TypeScript project

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template

## Deployment

Deploy with the cdk-deploy.sh script in the root of the aws-cdk folder. For example to deploy the prod environment run:

```./cdk-deploy-to.sh "AWS_ACCOUNT_ID" "AWS_REGION" -c env=prod```
