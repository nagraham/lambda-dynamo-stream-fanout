import { handler } from "../../../src/lambdas/todo-handler";

// todo one
const testIdOne = "test-id-1";
const testDescriptionOne = "test-description-1"
const testDateOne = new Date(2020, 1, 26, 12, 0, 0);

// todo two
const testIdTwo = "test-id-2";
const testDescriptionTwo = "test-description-2"
const testDateTwo = new Date(2020, 1, 26, 13, 0, 0);

// simple test case
describe("with batch containing single todo", () => {
  describe("and the todo is valid", () => {
    var fakeDynamoStreamBatch = {
      Records: [
        {
          dynamodb: {
            NewImage: {
              id: { "S": testIdOne },
              description: { "S": testDescriptionOne },
              testDateOne: { "S": testDateOne.toISOString() },
            }
          }
        }
      ]
    };

    test("it returns a list of ids processed", async () => {
      await handler(fakeDynamoStreamBatch).then(result => {
        expect(result).toEqual([testIdOne]);
      });
    });
  });

  describe("and the todo is invalid", () => {
    var fakeDynamoStreamBatch = {
      Records: [
        {
          dynamodb: {
            NewImage: {
              idd: { "S": testIdOne }
            }
          }
        }
      ]
    };

    test("it will execute an error", async () => {
      await handler(fakeDynamoStreamBatch).then(result => {
        console.log(result);
        fail("should not reach this statement");
      }).catch(err => {
        // don't care about error msg, just that it fails
      });
    });
  });
});

describe("with batch containing multiple item", () => {
  var fakeDynamoStreamBatch = {
    Records: [
      {
        dynamodb: {
          NewImage: {
            id: { "S": testIdOne },
            description: { "S": testDescriptionOne },
            testDateOne: { "S": testDateOne.toISOString() },
          }
        }
      },
      {
        dynamodb: {
          NewImage: {
            id: { "S": testIdTwo },
            description: { "S": testDescriptionTwo },
            testDateOne: { "S": testDateTwo.toISOString() },
          }
        }
      }
    ]
  };

  test("it returns a list of ids processed", async () => {
    await handler(fakeDynamoStreamBatch).then(result => {
      expect(result).toEqual([testIdOne, testIdTwo]);
    });
  });
});
