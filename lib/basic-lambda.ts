import * as core from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';

export interface BasicLambdaProps {
  name: string,
  handler: string
}

export class BasicLambda extends core.Construct {
  public readonly function: lambda.Function;

  constructor(scope: core.Construct, id: string, props: BasicLambdaProps) {
    super(scope, id);

    this.function = new lambda.Function(this, props.name, {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.asset("dist/bundle/"),
      handler: props.handler
    });
  }
}
