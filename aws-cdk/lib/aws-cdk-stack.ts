import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { StaticSite } from "./static-site";

export class AwsCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new StaticSite(this, "StaticSite");
  }
}
