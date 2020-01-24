import * as AWS from "aws-sdk";
import { Todo } from "./todo";
import { TodoDao } from "./todo-dao";

export interface TodoDynamoDaoParams {
  dynamo: AWS.DynamoDB.DocumentClient;
  tableName: string;
}

export class TodoDynamoDao implements TodoDao {
  private dynamo: AWS.DynamoDB.DocumentClient;
  private tableName: string;

  constructor(params: TodoDynamoDaoParams) {
    this.dynamo = params.dynamo;
    this.tableName = params.tableName;
  }

  public async putTodo(todo: Todo) {
    try {
      await this.dynamo.put({
        TableName: this.tableName,
        Item: {
          id: todo.id,
          description: todo.description,
          lastUpdatedDateTime: todo.lastUpdatedDateTime.toISOString(),
        }
      }).promise();
    } catch(err) {
      console.error(err.message);
    }
  }
}
