import * as dynamo from '@aws-cdk/aws-dynamodb';
import * as core from '@aws-cdk/core';

export class TodoDynamoTable extends core.Construct {
  constructor(scope: core.Construct, id: string) {
    super(scope, id);

    const todoTable = new dynamo.Table(scope, "TodoTable-20200118", {
      tableName: "TodoTable-20200118",
      partitionKey: {
        name: "id",
        type: dynamo.AttributeType.STRING
      }
    });
  }
}
