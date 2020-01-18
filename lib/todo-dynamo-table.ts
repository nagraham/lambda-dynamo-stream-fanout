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
      },
      stream: dynamo.StreamViewType.NEW_IMAGE,

      // $1.25/month/million writes ... or 0.00000125 per write (1/5th cost for reads)
      billingMode: dynamo.BillingMode.PAY_PER_REQUEST,

      // only because this is a test app
      removalPolicy: core.RemovalPolicy.DESTROY,
    });
  }
}
