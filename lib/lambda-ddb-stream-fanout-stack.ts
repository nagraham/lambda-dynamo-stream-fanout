import * as cdk from '@aws-cdk/core';
import * as dynamo from '@aws-cdk/aws-dynamodb';
import { DynamoTableWithStream } from '../lib/dynamo-table-with-stream';
import { LogInputLambda } from '../lib/log-input-lambda';

export class LambdaDdbStreamFanoutStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new DynamoTableWithStream(this, 'TodoDynamoTable', {
      tableName: "TodoTable-20200118",
      partitionKey: {
        name: "id",
        type: dynamo.AttributeType.STRING
      },
    });

    new LogInputLambda(this, 'LogInputLambdaOne', { name: "LogInputLambdaOne" })
  }
}
