import * as core from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import '@aws-cdk/assert/jest';
import { LogInputLambda } from "../../lib/log-input-lambda";

test("create log input lambda function", () => {
  const stack = new core.Stack();

  new LogInputLambda(stack, "test-lambda", {
    name: "test-lambda",
  });

  expect(stack).toHaveResource("AWS::Lambda::Function", {
    Runtime: lambda.Runtime.NODEJS_12_X.name,
    Handler: "log-input.handler"
  }); 
})
