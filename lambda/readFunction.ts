import type { APIGatewayProxyResultV2 } from 'aws-lambda';

import { Message } from './messagesTable';

export const handler = async (): Promise<APIGatewayProxyResultV2> => {
  const messages = await Message.find({ pk: 'message' }, { limit: 10, reverse: true });
  return { body: JSON.stringify(messages), statusCode: 200 };
};
