import * as core from '@aws-cdk/core';
import * as dynamo from '@aws-cdk/aws-dynamodb';
import { DynamoTableWithStream } from './dynamo-table-with-stream';
import { BasicLambda } from './basic-lambda';
import { LimitedRetryDynamoEventSource } from "./limited-retry-dynamo-event-source";

export class LambdaDdbStreamFanoutStack extends core.Stack {
  constructor(scope: core.Construct, id: string, props?: core.StackProps) {
    super(scope, id, props);

    const todoDynamoTable = new DynamoTableWithStream(this, 'TodoDynamoTable', {
      tableName: "TodoTable-20200118",
      partitionKey: {
        name: "id",
        type: dynamo.AttributeType.STRING,
      },
    });

    const logInputLambda = new BasicLambda(this, 'LogInputLambda', {
      name: "LogInputLambda",
      handler: "log-input.handler",
    });
    new LimitedRetryDynamoEventSource(this, "TodoTableToLogInputLambdaEventSource", {
      dynamoTable: todoDynamoTable.table,
      lambdaFunction: logInputLambda.function
    });

    const todoLambda = new BasicLambda(this, 'TodoLambda', {
      name: 'TodoLambda',
      handler: 'todo-handler.handler',
    })
    new LimitedRetryDynamoEventSource(this, "TodoTableToTodoLambdaEventSource", {
      dynamoTable: todoDynamoTable.table,
      lambdaFunction: todoLambda.function,
    })
  }
}
