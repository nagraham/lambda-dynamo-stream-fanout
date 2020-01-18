#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { LambdaDdbStreamFanoutStack } from '../lib/lambda-ddb-stream-fanout-stack';

const app = new cdk.App();
new LambdaDdbStreamFanoutStack(app, 'LambdaDdbStreamFanoutStack');
