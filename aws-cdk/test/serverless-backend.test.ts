import * as cdk from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { ServerlessBackend } from "../lib/serverless-backend";

describe("Serverless backend", () => {
  const stack = new cdk.Stack();
  new ServerlessBackend(stack, "ServerlessBackend");
  const template = Template.fromStack(stack);

  test("is created with correct resources", () => {
    // 2 Functions + LogRemoval
    template.resourceCountIs("AWS::Lambda::Function", 3);
    template.resourceCountIs("AWS::DynamoDB::Table", 1);
    template.resourceCountIs("AWS::ApiGatewayV2::Api", 1);
    template.resourceCountIs("AWS::ApiGatewayV2::Route", 2);
    template.resourceCountIs("AWS::ApiGatewayV2::Integration", 2);
    template.resourceCountIs("AWS::ApiGatewayV2::Stage", 1);
  });

  test("is created with correct configurations", () => {
    template.hasResourceProperties("AWS::Lambda::Function", {
      Handler: "index.handler",
      Runtime: "nodejs14.x",
    });

    template.hasResourceProperties("AWS::DynamoDB::Table", {
      BillingMode: "PAY_PER_REQUEST",
      TableName: "MessagesTable",
    });

    template.hasResourceProperties("AWS::ApiGatewayV2::Api", {
      Name: "MessagesApi",
    });
  });
});
