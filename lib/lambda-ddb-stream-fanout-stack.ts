import * as core from '@aws-cdk/core';
import * as dynamo from '@aws-cdk/aws-dynamodb';
import * as lambda from '@aws-cdk/aws-lambda';
import { DynamoEventSource } from '@aws-cdk/aws-lambda-event-sources';
import { DynamoTableWithStream } from '../lib/dynamo-table-with-stream';
import { LogInputLambda } from '../lib/log-input-lambda';

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

    logInputLambda.inputLambda.addEventSource(new DynamoEventSource(todoDynamoTable.table, {
      startingPosition: lambda.StartingPosition.LATEST,
      batchSize: 5,
      maxBatchingWindow: core.Duration.seconds(10),
    }));
  }
}
