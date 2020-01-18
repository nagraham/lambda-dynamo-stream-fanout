import * as cdk from '@aws-cdk/core';
import { TodoDynamoTable } from '../lib/todo-dynamo-table';

export class LambdaDdbStreamFanoutStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new TodoDynamoTable(this, 'TodoDynamoTable');
  }
}
