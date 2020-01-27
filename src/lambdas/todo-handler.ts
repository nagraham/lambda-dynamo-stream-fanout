import { AttributeMap } from 'aws-sdk/clients/dynamodb';
import { unmarshallItem, Schema } from '@aws/dynamodb-data-marshaller';
import { Todo } from '../todos';

const todoSchema: Schema = {
  id: { type: 'String', keyType: 'HASH' },
  description: { type: 'String' },
  lastUpdatedDateTime: { type: 'String' }
}

export const handler = async (event: any) : Promise<any> => {
  return event.Records.map((record: any) => {
    const attrMap: AttributeMap = record.dynamodb.NewImage;
    const todo: Todo = unmarshallItem(todoSchema, attrMap);
    validateTodo(todo);
    return todo.id;
  });
}

function validateTodo(todo: Todo) {
  if (todo.id === undefined) {
    throw new Error("Unxpected Error: could not unmarshall todo from DynamoDB stream event object");
  }
}
