import { Router } from "express";

import {
  //Post
  createPost,
  viewAllPost,
  viewPost,
  updatePost,
  deletePost,

  // Comment
  addComment,
  deleteMyComment,
  editMyComment,

  // Protect Routes
  protectRoute,

  //Middlewares
  preFillerForGettingUser,
  postData,
  postBelongsTo,
  commentBelongsTo,
} from "./../controller/forumController";

export const forumRouter = Router();

// Post Routers
forumRouter
  .route("/postNewThread")
  .post(protectRoute, preFillerForGettingUser, postData, createPost);

forumRouter.route("/viewPosts").get(viewAllPost);

// Takes Individual Document by Id
forumRouter.route("/viewPost/:id").get(viewPost);

forumRouter
  .route("/updatePost/:id")
  .patch(protectRoute, postBelongsTo, updatePost);

forumRouter
  .route("/deletePost/:id")
  .delete(protectRoute, postBelongsTo, deletePost);

// Comments

forumRouter
  .route("/addComment")
  .post(protectRoute, preFillerForGettingUser, addComment);

forumRouter
  .route("/deleteComment/:id")
  .delete(protectRoute, commentBelongsTo, deleteMyComment);

forumRouter
  .route("/updateComment/:id")
  .patch(protectRoute, commentBelongsTo, editMyComment);
