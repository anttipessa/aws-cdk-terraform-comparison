import { CfnOutput, RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { AttributeType, BillingMode, Table } from "aws-cdk-lib/aws-dynamodb";
import { Architecture } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import {
  CorsHttpMethod,
  HttpApi,
  HttpMethod,
} from "@aws-cdk/aws-apigatewayv2-alpha";
import { HttpLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import { LogGroup, RetentionDays } from "aws-cdk-lib/aws-logs";
import { PolicyStatement, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { CfnStage } from "aws-cdk-lib/aws-apigatewayv2";

export class ServerlessBackend extends Construct {
  constructor(parent: Stack, name: string) {
    super(parent, name);

    const table = new Table(this, "MessagesTable", {
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: { name: "pk", type: AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY,
      sortKey: { name: "sk", type: AttributeType.STRING },
      tableName: "MessagesTable",
    });

    const readFunction = new NodejsFunction(this, "ReadMsgsFn", {
      architecture: Architecture.ARM_64,
      entry: `./../lambda/readFunction.ts`,
      logRetention: RetentionDays.ONE_DAY,
    });

    const writeFunction = new NodejsFunction(this, "WriteMsgsFn", {
      architecture: Architecture.ARM_64,
      entry: `./../lambda/writeFunction.ts`,
      logRetention: RetentionDays.ONE_DAY,
    });

    table.grantReadData(readFunction);

    table.grantWriteData(writeFunction);

    const api = new HttpApi(this, "MessagesApi", {
      corsPreflight: {
        allowHeaders: ["Content-Type"],
        allowMethods: [CorsHttpMethod.GET, CorsHttpMethod.POST],
        allowOrigins: ["*"],
      },
    });

    const accessLogs = new LogGroup(this, 'APIGW-AccessLogs', {
      logGroupName: 'APIGW-AccessLogs',
      retention: RetentionDays.ONE_DAY,
    })

    const stage = api.defaultStage?.node.defaultChild as CfnStage
    stage.accessLogSettings = {
      destinationArn: accessLogs.logGroupArn,
      format: JSON.stringify({
        requestId: '$context.requestId',
        userAgent: '$context.identity.userAgent',
        sourceIp: '$context.identity.sourceIp',
        requestTime: '$context.requestTime',
        requestTimeEpoch: '$context.requestTimeEpoch',
        httpMethod: '$context.httpMethod',
        path: '$context.path',
        status: '$context.status',
        protocol: '$context.protocol',
        responseLength: '$context.responseLength',
        domainName: '$context.domainName'
      })
    }

    const role = new Role(this, 'ApiGWLogWriterRole', {
      assumedBy: new ServicePrincipal('apigateway.amazonaws.com')
    })

    const policy = new PolicyStatement({
      actions: [
        'logs:CreateLogGroup',
        'logs:CreateLogStream',
        'logs:DescribeLogGroups',
        'logs:DescribeLogStreams',
        'logs:PutLogEvents',
        'logs:GetLogEvents',
        'logs:FilterLogEvents'
      ],
      resources: ['*']
    })

    role.addToPolicy(policy)
    accessLogs.grantWrite(role)

    const readIntegration = new HttpLambdaIntegration(
      "ReadIntegration",
      readFunction
    );

    const writeIntegration = new HttpLambdaIntegration(
      "WriteIntegration",
      writeFunction
    );

    api.addRoutes({
      integration: readIntegration,
      methods: [HttpMethod.GET],
      path: "/messages",
    });

    api.addRoutes({
      integration: writeIntegration,
      methods: [HttpMethod.POST],
      path: "/messages",
    });

    new CfnOutput(this, "HttpApiUrl", { value: api.apiEndpoint });
  }
}
