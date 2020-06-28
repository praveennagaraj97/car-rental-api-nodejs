import { ToDo } from "./../model/todoModel";

import {
  createDocument,
  readAllDocument,
  deleteDocument,
  updateDocumentByID,
} from "./../handlers/factoryHandler";

// Protect Routes
export { protectRoute } from "./userController";

// Middleware
export {
  preFillerForGettingUser,
  setTodoTime,
} from "./../middleware/preFillers";

import { getReviewOfCurrentUser } from "./../middleware/preFillers";
export const getToDoOfCurrentUser = getReviewOfCurrentUser;

import { checkingToWhomDocumentBelongs } from "./../middleware/preCheckers";
export const todoBelongTo = checkingToWhomDocumentBelongs(ToDo);

// Operations
export const newToDoList = createDocument(ToDo, {
  message: "ToDo added to your List.",
});

export const getList = readAllDocument(ToDo, {
  message: "List Of Tasks",
});

export const updateList = updateDocumentByID(ToDo, {
  message: "List Updated",
});

export const deleteList = deleteDocument(ToDo, {
  message: "List Deleted Successfully",
});
