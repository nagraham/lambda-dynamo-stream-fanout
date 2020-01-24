import { Todo } from "./todo";

export interface TodoDao {
  putTodo(todo: Todo): Promise<void>;
}
