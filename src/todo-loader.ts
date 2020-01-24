import * as todo from "./todos";
import * as AWS from "aws-sdk";

AWS.config.credentials = new AWS.SharedIniFileCredentials({ profile: 'dev' })

const todoDao: todo.TodoDao = new todo.TodoDynamoDao({
  tableName: "TodoTable-20200118",
  dynamo: new AWS.DynamoDB.DocumentClient({ region: 'us-west-2' }),
});

const todos: todo.Todo[] = [
  { id: '123-abc', description: 'a basic todo', lastUpdatedDateTime: new Date() },
  { id: '428-dms', description: 'implement a second lambda', lastUpdatedDateTime: new Date() },
  { id: '12s-00d', description: 'experiment with lambda errors reading stream', lastUpdatedDateTime: new Date() }
]

const load = async () => {
  const promises: Array<Promise<number>> = new Array<Promise<number>>();
  const successList: string[] = [];
  const errorList: string[] = [];

  todos.forEach(todo => {
    promises.push(todoDao.putTodo(todo)
      .then(() => successList.push(todo.id))
      .catch((err) => errorList.push(todo.id + " failed: " + err.message)));
  });

  Promise.all(promises)
    .then(() => {
      console.log("Successful puts: " + successList.length);
      if (errorList.length === 0) {
        console.log("No errors :D");
      } else {
        errorList.forEach(msg => console.log(msg));
      }
    });
}

load();
