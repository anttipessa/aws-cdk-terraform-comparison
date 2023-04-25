import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { ServerlessBackend } from "./serverless-backend";
import { StaticSite } from "./static-site";

export class AwsCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    new StaticSite(this, "StaticSite", {
      env: this.node.tryGetContext("env"),
      bucketName: this.node.tryGetContext("bucketname"),
    });
    new ServerlessBackend(this, "ServerlessBackend", {
      env: this.node.tryGetContext("env"),
      tableName: this.node.tryGetContext("table"),
    });
  }
}
