import * as todos from "../../../src/todos";
import * as AWSMock from "aws-sdk-mock";
import * as AWS from "aws-sdk";
import { DocumentClient, PutItemInput } from "aws-sdk/clients/dynamodb";

const testTableName = "TableTableTable";
const testIdOne = "testId-1";
const testDescription = "test description";
const testDate = new Date(2020, 0, 1, 1, 2, 3);

describe("putTodo", () => {
  afterEach(() => AWSMock.restore());

  it("should call DocumentClient#put with the expected Todo input", () => {
    AWSMock.setSDKInstance(AWS);
    AWSMock.mock('DynamoDB.DocumentClient', 'put', (params: PutItemInput, callback: Function) => {
      console.log("mock called");
      expect(params.TableName).toBe(testTableName);
      expect(params.Item["id"]).toBe(testIdOne);
      expect(params.Item["description"]).toBe(testDescription);
      expect(params.Item["lastUpdatedDateTime"]).toBe(testDate.toISOString());
      callback();
    });

    const todoDao = new todos.TodoDynamoDao ({
      dynamo:  new DocumentClient(),
      tableName: testTableName,
    });

    return todoDao.putTodo({
      id: testIdOne,
      description: testDescription,
      lastUpdatedDateTime: testDate,
    });
  });
});
