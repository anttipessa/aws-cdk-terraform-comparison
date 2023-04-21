import { CfnOutput, RemovalPolicy, Stack } from "aws-cdk-lib";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import * as apigw2 from "@aws-cdk/aws-apigatewayv2-alpha";
import { HttpLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import { LogGroup, RetentionDays } from "aws-cdk-lib/aws-logs";
import * as iam from "aws-cdk-lib/aws-iam";
import { CfnStage } from "aws-cdk-lib/aws-apigatewayv2";

export class ServerlessBackend extends Construct {
  constructor(parent: Stack, name: string) {
    super(parent, name);

    const table = new dynamodb.Table(this, "MessagesTable", {
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      partitionKey: { name: "pk", type: dynamodb.AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY,
      sortKey: { name: "sk", type: dynamodb.AttributeType.STRING },
      tableName: "MessagesTable",
    });

    const readFunction = new NodejsFunction(this, "ReadMsgsFn", {
      runtime: lambda.Runtime.NODEJS_14_X,
      architecture: lambda.Architecture.ARM_64,
      entry: `./../lambda/readFunction.ts`,
      logRetention: RetentionDays.ONE_DAY,
    });

    const writeFunction = new NodejsFunction(this, "WriteMsgsFn", {
      runtime: lambda.Runtime.NODEJS_14_X,
      architecture: lambda.Architecture.ARM_64,
      entry: `./../lambda/writeFunction.ts`,
      logRetention: RetentionDays.ONE_DAY,
    });

    table.grantReadData(readFunction);

    table.grantWriteData(writeFunction);

    const api = new apigw2.HttpApi(this, "MessagesApi", {
      corsPreflight: {
        allowHeaders: ["Content-Type"],
        allowMethods: [apigw2.CorsHttpMethod.GET, apigw2.CorsHttpMethod.POST],
        allowOrigins: ["*"],
      },
    });

    const accessLogs = new LogGroup(this, "APIGW-AccessLogs", {
      retention: RetentionDays.ONE_DAY,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const stage = api.defaultStage?.node.defaultChild as CfnStage;
    stage.accessLogSettings = {
      destinationArn: accessLogs.logGroupArn,
      format: JSON.stringify({
        requestId: "$context.requestId",
        userAgent: "$context.identity.userAgent",
        sourceIp: "$context.identity.sourceIp",
        requestTime: "$context.requestTime",
        requestTimeEpoch: "$context.requestTimeEpoch",
        httpMethod: "$context.httpMethod",
        path: "$context.path",
        status: "$context.status",
        protocol: "$context.protocol",
        responseLength: "$context.responseLength",
        domainName: "$context.domainName",
      }),
    };

    const role = new iam.Role(this, "ApiGWLogWriterRole", {
      assumedBy: new iam.ServicePrincipal("apigateway.amazonaws.com"),
    });

    const policy = new iam.PolicyStatement({
      actions: [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:DescribeLogGroups",
        "logs:DescribeLogStreams",
        "logs:PutLogEvents",
        "logs:GetLogEvents",
        "logs:FilterLogEvents",
      ],
      resources: ["*"],
    });

    role.addToPolicy(policy);
    accessLogs.grantWrite(role);

    const readIntegration = new HttpLambdaIntegration("ReadIntegration", readFunction);

    const writeIntegration = new HttpLambdaIntegration("WriteIntegration", writeFunction);

    api.addRoutes({
      integration: readIntegration,
      methods: [apigw2.HttpMethod.GET],
      path: "/messages",
    });

    api.addRoutes({
      integration: writeIntegration,
      methods: [apigw2.HttpMethod.POST],
      path: "/messages",
    });

    new CfnOutput(this, "HttpApiUrl", { value: api.apiEndpoint });
  }
}
