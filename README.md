# Lambda DynamoDB-Stream Fanout Prototype

Lately I have been interested in event-driven architectures built on serverless resources. This is a little project to experiment with one possible design pattern: AWS lambdas triggered by a Dynamo stream.

Both Kinesis and Dynamo streams can be used to trigger lambdas. Kinesis has a considerable advantage in throughput with their "enhanced fanout" mode ([aws blog post](https://aws.amazon.com/blogs/compute/increasing-real-time-stream-processing-performance-with-amazon-kinesis-data-streams-enhanced-fan-out-and-aws-lambda/)). But Dynamo streams has its own powerful advantage: records are guaranteed to be written to the stream "exactly once," ([source](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Streams.html)) whereas Kinesis is limited to "at least once" ([source](https://docs.aws.amazon.com/streams/latest/dev/kinesis-record-processor-duplicates.html)). Writing a record to a Kinesis stream is not an idempotent operation -- if a producer sends a record multiple times (perhaps retrying because the response from Kinesis got dropped), it will be written to the stream multiple times. On the other hand, Dynamo's backend services are the producer: when they detect a change in your table, they write that change to the stream -- and they have evidentially built the infrastructure necessary to make it happen exactly once. Nice! So your lambda will only see a change event record in the stream once and only once (Of course, the lambda may execute on that record multiple times if the lambda fails and needs to reprocess it -- so that's a good reason to make sure the actions your Lambda takes are idempotent as well).

But this isn't the end of the story. Just because one component has "exactly once" semantics, it does not magically make your entire system "exactly once." You need consider the whole flow of your app. If the thing writing to Dynamo writes the exact same record multiple times (perhaps due to retries), then Dynamo will write the record twice, and emit two change events. Fortunately, you can make writes to Dynamo idempotent with [versioning + conditional updates](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ConditionExpressions.html). The Java-based DynamoMapper provides a higher level abstraction in [Optimistic Locking](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBMapper.OptimisticLocking.html)). And [AWS's DynamoDB Data Mapper library](https://www.npmjs.com/package/aws-dynamodb-data-mapper) provides version checking as well, although they don't explicitly say it in their README ... they just mention a `skipVersionCheck` attribute, which [from looking at the code](https://github.com/awslabs/dynamodb-data-mapper-js/blob/master/packages/dynamodb-data-mapper/src/DataMapper.ts#L453), does add a condition expression based on your object's versioning attribute.

So in summary, if you have a component in your system that requires exactly once fault tolerance, Idempotent PUT to Dynamo + Streams + Lambda is a way to get it.

## Set up workspace

You'll need the following in your development environment
- Node
- AWS CLI
- AWS Credentials set in ~./aws/credentials (`aws configure`)
- TypeScript (`npm install -g typescript ts-node`)
- CDK (`npm install -g aws-cdk`)

## Deploy

After you have set up your environment, it's simple:

```
npm run release
```

If it's your first time building, run:

```
cdk bootstrap
```

And then run:

```
cdk deploy
```

Although `cdk deploy` will take care of wrapping your code up and sending it to S3, it doesn't do anything to package up TypeScript or node_modules or anything (the Serverless Framework evidentially has some nice stuff, so maybe I'll use that in another project). This package uses Webpack to transform and bundle the code + imported dependencies into a single `handlers.js` file that we can deploy to lambda. It runs in "development" mode so it will include the full source map so that exceptions will accurately refer to the original TypeScript file's lines (normally not kosher for production frontend code where you wouldn't want users to snoop through your code). Webpack in general is a nice alternative to some other ideas for bundling in dependencies, [like copying the full node_modules file](https://github.com/aws-samples/aws-cdk-examples/issues/110), and deploying that to lambda -- that is just hacky and wrong (this is a prototype project, and the node_modules package is already 250MB . . . ).

## Load data to Dynamo

You can modify the `./src/todo-loader.ts` file to modify the data there, and the run the following command:

```
ts-node ./src/todo-loader.ts
```


## Useful commands

 * `npm run clean`   clean typescript build artifacts (wipe the dist/ directory)
 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `npm run release` clean, build, and test
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template
 * `cdk bootstrap`   initial set up of the application
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk destroy`     tear down the app after done with testing
