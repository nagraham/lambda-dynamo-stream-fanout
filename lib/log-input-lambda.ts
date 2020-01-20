import * as core from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';

export interface LogInputLambdaProps {
  name: string,
}

export class LogInputLambda extends core.Construct {
  constructor(scope: core.Construct, id: string, props: LogInputLambdaProps) {
    super(scope, id);

    new lambda.Function(this, props.name, {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.asset("dist/src/lambdas"),
      handler: "log-input.handler"
    });
  }
}
