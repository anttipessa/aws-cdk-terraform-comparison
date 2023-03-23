import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";

import { Message } from "./messagesTable";

export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  const body = event.body;
  if (body) {
    const messages = await Message.create(JSON.parse(body));
    return { body: JSON.stringify(messages), statusCode: 200 };
  }
  return { body: "Error, invalid input!", statusCode: 400 };
};
