import { SynthUtils } from '@aws-cdk/assert';
import * as core from '@aws-cdk/core';
import LambdaDdbStreamFanout = require('../../lib/lambda-ddb-stream-fanout-stack');

test('SNAPSHOT: Lambda dynamodb fanout stack', () => {
  const app = new core.App();
  const stack = new LambdaDdbStreamFanout.LambdaDdbStreamFanoutStack(app, 'TestFanoutStack');
  expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
})

// test('Empty Stack', () => {
//     const app = new cdk.App();
//     // WHEN
//     const stack = new LambdaDdbStreamFanout.LambdaDdbStreamFanoutStack(app, 'MyTestStack');
//     // THEN
//     expectCDK(stack).to(matchTemplate({
//       "Resources": {}
//     }, MatchStyle.EXACT))
// });
