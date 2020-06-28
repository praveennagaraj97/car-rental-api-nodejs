// Model
import { ForumPost, ForumComment } from "./../model/forumModel";

// Handler
import {
  createDocument,
  updateDocumentByID,
  deleteDocument,
  readAllDocument,
  readDocumentByID,
  imageUploader,
} from "./../handlers/factoryHandler";

// Middlewares
export { preFillerForGettingUser } from "./../middleware/preFillers";

import { processDataWithMultipleImage } from "./../middleware/imageProcessing";

import { checkingToWhomDocumentBelongs } from "./../middleware/preCheckers";

// Protect Routes
export { protectRoute, restrictRoute } from "./../controller/userController";

// Post Takes 2 Photos.
export const postData = processDataWithMultipleImage(
  "postImages",
  "mongoforumpost",
  2
);

export const createPost = createDocument(ForumPost, {
  message: "New Post Added To The Forum",
});

export const viewAllPost = readAllDocument(ForumPost, {
  message: "List Of Posts",
});

export const viewPost = readDocumentByID(ForumPost, {
  message: "Post Details",
});

// Check Post Belongs To
export const postBelongsTo = checkingToWhomDocumentBelongs(ForumPost);
export const updatePost = updateDocumentByID(ForumPost, {
  message: "Post Updated SuccessFully",
});

export const deletePost = deleteDocument(ForumPost, {
  message: "Post Deleted",
});

// Comment Related Controller.

export const commentBelongsTo = checkingToWhomDocumentBelongs(ForumComment);

export const addComment = createDocument(ForumComment, {
  message: "Comment Added",
});

export const editMyComment = updateDocumentByID(ForumComment, {
  message: "Comment Updated",
});

export const deleteMyComment = deleteDocument(ForumComment, {
  message: "Comment Deleted",
});
