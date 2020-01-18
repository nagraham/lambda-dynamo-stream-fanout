import * as dynamo from '@aws-cdk/aws-dynamodb';
import * as core from '@aws-cdk/core';

export interface DynamoTableWithStreamProps extends dynamo.TableProps {
}

export class DynamoTableWithStream extends core.Construct {
  constructor(scope: core.Construct, id: string, props: DynamoTableWithStreamProps) {
    super(scope, id);

    const table = new dynamo.Table(scope, props.tableName || "dynamo-table", {
      ...props, // merge in props

      stream: dynamo.StreamViewType.NEW_IMAGE,

      // $1.25/month/million writes ... or 0.00000125 per write (1/5th cost for reads)
      billingMode: dynamo.BillingMode.PAY_PER_REQUEST,

      // only because this is a test app
      removalPolicy: core.RemovalPolicy.DESTROY,
    });
  }
}
