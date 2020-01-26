import { Construct, Duration } from "@aws-cdk/core";
import { Table } from "@aws-cdk/aws-dynamodb"
import { CfnEventSourceMapping, EventSourceMapping, Function, StartingPosition } from "@aws-cdk/aws-lambda";

export interface LimitedRetryDynamoEventSourceProps {
  dynamoTable: Table;
  lambdaFunction: Function;
  batchSize?: number;           // default: 3 records
  maxBatchingWindow?: number;   // default: 10 seconds
  maxRetries?: number;          // default: 3 retries
}

/**
 * Wraps up the messiness of creating a raw EventSourceMapping that has the newer
 * failure handling features (like setting maxRetires). We need to use the EventSourceMapping
 * because a DynamoEventSource does not have a "node" attribute I can use to get to the
 * Cfn "Escape Hatch" (https://docs.aws.amazon.com/cdk/latest/guide/cfn_layer.html).
 *
 * I'm also replicating most of the core action in the DynamoEventSource:
 * https://github.com/aws/aws-cdk/blob/master/packages/%40aws-cdk/aws-lambda-event-sources/lib/dynamodb.ts
 */
export class LimitedRetryDynamoEventSource extends Construct {
  constructor(scope: Construct, id: string, props: LimitedRetryDynamoEventSourceProps) {
    super(scope, id);

    const eventSourceMapping = new EventSourceMapping(scope, id + "mapping", {
      eventSourceArn: props.dynamoTable.tableStreamArn as string,
      target: props.lambdaFunction,
      batchSize: props.batchSize || 3,
      maxBatchingWindow: Duration.seconds(props.maxBatchingWindow || 10),
      startingPosition: StartingPosition.LATEST
    });

    // escape hatch
    const cfnEventSourceMapping = eventSourceMapping.node.defaultChild as CfnEventSourceMapping;
    cfnEventSourceMapping.maximumRetryAttempts = props.maxRetries || 3;

    props.dynamoTable.grantStreamRead(props.lambdaFunction);
  }
}
