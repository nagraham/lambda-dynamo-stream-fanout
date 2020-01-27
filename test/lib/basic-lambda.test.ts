import * as core from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import '@aws-cdk/assert/jest';
import { BasicLambda } from "../../lib/basic-lambda";

test("create test lambda function", () => {
  const stack = new core.Stack();

  new BasicLambda(stack, "test-lambda", {
    name: "test-lambda",
    handler: "foo.handler",
  });

  expect(stack).toHaveResource("AWS::Lambda::Function", {
    Runtime: lambda.Runtime.NODEJS_12_X.name,
    Handler: "foo.handler"
  });
})

test("create two lambda functions", () => {
  const stack = new core.Stack();

  new BasicLambda(stack, "test-lambda", {
    name: "test-lambda",
    handler: "foo.handler",
  });

  new BasicLambda(stack, "test-lambda2", {
    name: "test-lambda2",
    handler: "bar.handler",
  });

  expect(stack).toHaveResource("AWS::Lambda::Function", {
    Runtime: lambda.Runtime.NODEJS_12_X.name,
    Handler: "foo.handler"
  });

  expect(stack).toHaveResource("AWS::Lambda::Function", {
    Runtime: lambda.Runtime.NODEJS_12_X.name,
    Handler: "bar.handler"
  });
})
