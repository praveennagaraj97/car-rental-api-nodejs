import { Router } from "express";

import {
  joinSocialMedia,
  updateProfilePic,
  updateProfile,

  // friends
  sendFriendRequest,
  acceptFriendRequest,

  // Posts
  addNewPostToSocialMedia,
  profileBelongsTo,
  deletePost,

  // Comments
  commentOnPost,
  deleteCommentOfPost,
  replyToComment,

  // Likes
  LikeOnPost,
  unLikePost,

  //Feed
  getPostOfMineAndFriends,

  //Middlewares
  preFillerForGettingUser,
  signUpSMData,
  getProfileId,
  postImages,
  profile,
  postbelongsTo,
  preFillPostForCommentingAndLiking,
  preFillPostForcommentReply,
  commentBelongsTo,
  LikeBelongsTo,
  checkPostExistToCommentOrLike,
  setmyfeedSortedByLatest,

  //Security Access
  protectRoute,
  preFillFriendId,
} from "./../controller/socialMediaController";

export const socialMediaRouter = Router();

socialMediaRouter
  .route("/joinWithUs")
  .post(protectRoute, preFillerForGettingUser, signUpSMData, joinSocialMedia);

socialMediaRouter
  .route("/updateProfilePic/:id")
  .post(
    protectRoute,
    preFillerForGettingUser,
    profileBelongsTo,
    updateProfilePic
  );

socialMediaRouter
  .route("/updateProfileBio/:id")
  .patch(protectRoute, profileBelongsTo, updateProfile);

// Posts Routes
socialMediaRouter
  .route("/uploadNewPost")
  .post(protectRoute, getProfileId, postImages, addNewPostToSocialMedia);

socialMediaRouter
  .route("/deleteMyPost/:id")
  .delete(protectRoute, profile, postbelongsTo, deletePost);

// Comment On Post
socialMediaRouter
  .route("/comment/:id")
  .post(
    protectRoute,
    checkPostExistToCommentOrLike,
    profile,
    preFillPostForCommentingAndLiking,
    commentOnPost
  );

socialMediaRouter
  .route("/deleteComment/:id")
  .delete(protectRoute, profile, commentBelongsTo, deleteCommentOfPost);

socialMediaRouter
  .route("/replycomment/:id")
  .post(protectRoute, profile, preFillPostForcommentReply, replyToComment);

// Like
socialMediaRouter.route("/like/:id").post(
  protectRoute,
  profile,

  preFillPostForCommentingAndLiking,
  LikeOnPost
);

socialMediaRouter
  .route("/unDoLike/:id")
  .delete(protectRoute, profile, LikeBelongsTo, unLikePost);

// Adding Friends
socialMediaRouter
  .route("/sendRequest/:id")
  .post(
    protectRoute,
    profile,
    getProfileId,
    preFillFriendId,
    sendFriendRequest
  );

socialMediaRouter
  .route("/acceptrequests/:id")
  .post(protectRoute, profile, acceptFriendRequest);

// GET My Feed.
socialMediaRouter
  .route("/myFeed")
  .get(protectRoute, profile, setmyfeedSortedByLatest, getPostOfMineAndFriends);
