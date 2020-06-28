import { Router } from "express";

import {
  newToDoList,
  getList,
  updateList,
  deleteList,

  // Middleware
  preFillerForGettingUser,
  setTodoTime,
  getToDoOfCurrentUser,
  todoBelongTo,

  // Protect Access
  protectRoute,
} from "./../controller/todoController";

export const todoRouter = Router();

todoRouter
  .route("/newList")
  .post(protectRoute, preFillerForGettingUser, setTodoTime, newToDoList);

todoRouter.route("/getList").get(protectRoute, getToDoOfCurrentUser, getList);

todoRouter
  .route("/updateMyList/:id")
  .patch(protectRoute, todoBelongTo, updateList);

todoRouter
  .route("/deleteMyList/:id")
  .delete(protectRoute, todoBelongTo, deleteList);
