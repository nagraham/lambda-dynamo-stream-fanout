import * as todoHandler from "./lambdas/todo-handler";
import * as logInputHandler from "./lambdas/log-input";

export const handleTodos: Function = todoHandler.handler;
export const logInput: Function = logInputHandler.handler;
