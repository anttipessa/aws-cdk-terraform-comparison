import * as cdk from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { AwsCdkStack } from "../lib/aws-cdk-stack";


describe("AWS CDK Stack", () => {
  test("matches the snapshot", () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app);
    const CDKStack = new AwsCdkStack(stack, "AWSCDKStack");
    const template = Template.fromStack(CDKStack);
    expect(template.toJSON()).toMatchSnapshot();
  });
});
