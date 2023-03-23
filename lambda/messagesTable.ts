import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { Entity, Table } from 'dynamodb-onetable';
import Dynamo from 'dynamodb-onetable/Dynamo';

const client = new Dynamo({ client: new DynamoDBClient({}) });

const schema = {
  indexes: {
    primary: {
      hash: 'pk',
      sort: 'sk',
    },
  },
  models: {
    message: {
      type: {
        required: true,
        type: 'string',
        value: 'message',
      },
      pk: {
        type: 'string',
        value: 'message',
      },
      sk: {
        type: 'string',
        value: '${date}',
      },
      message: {
        required: true,
        type: 'string',
      },
      date: {
        required: true,
        type: 'string',
      },
      sender: {
        required: true,
        type: 'string',
      },
    },
  },
  version: '0.1.0',
  params: {
    typeField: 'type',
  },
  format: 'onetable:1.0.0',
} as const;

export type MessageType = Entity<typeof schema.models.message>;

const table = new Table({
  client,
  name: 'MessagesTable',
  schema,
  timestamps: true,
});

export const Message = table.getModel<MessageType>('message');
