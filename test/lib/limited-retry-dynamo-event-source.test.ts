import '@aws-cdk/assert/jest';
import { LimitedRetryDynamoEventSource } from '../../lib/limited-retry-dynamo-event-source';
import { Stack } from "@aws-cdk/core";
import { AttributeType, StreamViewType, Table } from "@aws-cdk/aws-dynamodb";
import { Code, Function, Runtime } from "@aws-cdk/aws-lambda";

var stack: Stack;
var testDynamoTable: Table;
var testFunction: Function;

beforeEach(() => {
  stack = new Stack();

  testDynamoTable = new Table(stack, "testTable", {
    partitionKey: {
      name: "id",
      type: AttributeType.STRING,
    },
    stream: StreamViewType.NEW_IMAGE
  });

  testFunction = new Function(stack, "testFunction", {
    runtime: Runtime.NODEJS_12_X,
    code: Code.asset("dist/src/lambdas"), // needs to be a real directory
    handler: "fake.handler"
  });
});

test('create a LimitedRetryDynamoEventSource with defaults creates EventSourceMapping', () => {
  new LimitedRetryDynamoEventSource(stack, "testEventSource", {
    dynamoTable: testDynamoTable,
    lambdaFunction:testFunction
  });

  expect(stack).toHaveResource("AWS::Lambda::EventSourceMapping", {
    BatchSize: 3,
    EventSourceArn: {
      "Fn::GetAtt": [
        "testTableFD9E8557", // deterministically created (using table.node.uniqueId didn't work)
        "StreamArn"
      ]
    },
    FunctionName: {
      Ref: "testFunction483F4CBE"
    },
    MaximumBatchingWindowInSeconds: 10,
    MaximumRetryAttempts: 3,
    StartingPosition: "LATEST"
  });
});

test('creating a LimitedRetryDynamoEventSource sets IAM permissions on Lambda', () => {
  new LimitedRetryDynamoEventSource(stack, "testEventSource", {
    dynamoTable: testDynamoTable,
    lambdaFunction:testFunction
  });

  expect(stack).toHaveResource("AWS::IAM::Policy", {
    PolicyDocument: {
      Statement: [
        {
          Action: "dynamodb:ListStreams",
          Effect: "Allow",
          Resource: {
            "Fn::Join": [
              "",
              [
                {
                  "Fn::GetAtt": [
                    "testTableFD9E8557",
                    "Arn"
                  ]
                },
                "/stream/*"
              ]
            ]
          }
        },
        {
          "Action": [
            "dynamodb:DescribeStream",
            "dynamodb:GetRecords",
            "dynamodb:GetShardIterator"
          ],
          "Effect": "Allow",
          "Resource": {
            "Fn::GetAtt": [
              "testTableFD9E8557",
              "StreamArn"
            ]
          }
        }
      ],
      "Version": "2012-10-17"
    },
    Roles: [
      {
        "Ref": "testFunctionServiceRoleFEC29B6F"
      }
    ]
  });
});

test('creating a LimitedRetryDynamoEventSource with maxRetryAttempts sets that in the EventMappingSource', () => {
  new LimitedRetryDynamoEventSource(stack, "testEventSource", {
    dynamoTable: testDynamoTable,
    lambdaFunction:testFunction,
    maxRetries: 42,
  });

  expect(stack).toHaveResource("AWS::Lambda::EventSourceMapping", {
    MaximumRetryAttempts: 42
  });
});

test('creating a LimitedRetryDynamoEventSource with batchSize sets that in the EventMappingSource', () => {
  new LimitedRetryDynamoEventSource(stack, "testEventSource", {
    dynamoTable: testDynamoTable,
    lambdaFunction:testFunction,
    batchSize: 101,
  });

  expect(stack).toHaveResource("AWS::Lambda::EventSourceMapping", {
    BatchSize: 101
  });
});

test('creating a LimitedRetryDynamoEventSource with maxBatchingWindow sets that in the EventMappingSource', () => {
  new LimitedRetryDynamoEventSource(stack, "testEventSource", {
    dynamoTable: testDynamoTable,
    lambdaFunction:testFunction,
    maxBatchingWindow: 33,
  });

  expect(stack).toHaveResource("AWS::Lambda::EventSourceMapping", {
    MaximumBatchingWindowInSeconds: 33
  });
});
