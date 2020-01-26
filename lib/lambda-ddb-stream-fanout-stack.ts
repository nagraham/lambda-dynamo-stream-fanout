import * as core from '@aws-cdk/core';
import * as dynamo from '@aws-cdk/aws-dynamodb';
import { DynamoTableWithStream } from './dynamo-table-with-stream';
import { LogInputLambda } from './log-input-lambda';
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

    const logInputLambda = new LogInputLambda(this, 'LogInputLambdaOne', { name: "LogInputLambdaOne" });

    new LimitedRetryDynamoEventSource(this, "LimitedRetryDynamoEventSource", {
      dynamoTable: todoDynamoTable.table,
      lambdaFunction: logInputLambda.inputLambda
    });
  }
}
