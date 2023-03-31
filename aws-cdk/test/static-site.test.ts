import * as cdk from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { StaticSite } from "../lib/static-site";

describe("Static site", () => {
  const stack = new cdk.Stack();
  new StaticSite(stack, "StaticSite");
  const template = Template.fromStack(stack);

  test("is created with correct amount of resources", () => {
    template.resourceCountIs("AWS::S3::Bucket", 1);
    template.resourceCountIs("AWS::CloudFront::Distribution", 1);
  });

  test("is created with correct configurations", () => {
    template.hasResourceProperties("AWS::S3::Bucket", {
      BucketName: "react-bucket-hosted-aws-s3-cdk",
      AccessControl: "Private",
    });

    template.hasResourceProperties("AWS::CloudFront::Distribution", {
      DistributionConfig: {
        DefaultRootObject: "index.html",
        Enabled: true,
        HttpVersion: "http2",
        IPV6Enabled: true,
        PriceClass: "PriceClass_100",
      },
    });
  });
});
