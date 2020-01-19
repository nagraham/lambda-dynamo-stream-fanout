import * as core from '@aws-cdk/core';
import * as dynamo from '@aws-cdk/aws-dynamodb';
import { DynamoTableWithStream } from '../../lib/dynamo-table-with-stream';
import '@aws-cdk/assert/jest';
import { ResourcePart } from '@aws-cdk/assert';

test('create dynamo table with name and partition key', () => {
  const stack = new core.Stack();

  new DynamoTableWithStream(stack, 'TestTable', {
    tableName: "test-table-name",
    partitionKey: {
      name: "test-id",
      type: dynamo.AttributeType.STRING
    }
  });

  expect(stack).toHaveResource('AWS::DynamoDB::Table', {
    Properties: {
      TableName: "test-table-name",
      KeySchema: [
        {
          AttributeName: "test-id",
          KeyType: "HASH"
        }
      ],
      AttributeDefinitions: [
        {
          AttributeName: "test-id",
          AttributeType: "S"
        }
      ],
      BillingMode: "PAY_PER_REQUEST",
      StreamSpecification: {
        "StreamViewType": "NEW_IMAGE"
      },
    },
    UpdateReplacePolicy: "Delete",
    DeletionPolicy: "Delete",
  }, ResourcePart.CompleteDefinition);
});
