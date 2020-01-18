import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import LambdaDdbStreamFanout = require('../lib/lambda-ddb-stream-fanout-stack');

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new LambdaDdbStreamFanout.LambdaDdbStreamFanoutStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
