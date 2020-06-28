import {
  SMProfile,
  SMPost,
  SMComment,
  SMLike,
  SMReplyCommnet,
  SMFriendRequest,
  SMFriends,
} from "./../model/socialMediaModel";

import {
  createDocument,
  updateDocumentByID,
  imageUploader,
  readAllDocument,
  readDocumentByID,
  deleteDocument,
} from "./../handlers/factoryHandler";

export { protectRoute } from "./userController";

// Middlewares
export {
  preFillerForGettingUser,
  setUserForUpdatingProfilePic,
  preFillPostForCommentingAndLiking,
  preFillPostForcommentReply,
  preFillFriendId,
  setmyfeedSortedByLatest,
} from "./../middleware/preFillers";

import {
  checkingToWhomDocumentBelongs,
  checkWetherThisBelongsTo,
  checkWetherReferenceExist,
} from "./../middleware/preCheckers";
export const profileBelongsTo = checkingToWhomDocumentBelongs(SMProfile);

import { setProfileId, getProfile } from "./../middleware/preFillers";

export const getProfileId = setProfileId(SMProfile);

export const profile = getProfile(SMProfile);

import {
  processDataWithSingleImage,
  processDataWithMultipleImage,
} from "./../middleware/imageProcessing";

import { sendRequest, respondToRequest } from "../handlers/socialMediaHandler";

// Before Someone Joins They Should Have Account With Us As It is EDD's Social Media Service

export const signUpSMData = processDataWithSingleImage(
  "profilePic",
  "mongosmprofilepic"
);

export const joinSocialMedia = createDocument(SMProfile, {
  message: "Thank You For Joining",
  message1: "Successfully Joined Our Social Media Service",
});

export const updateProfilePic = imageUploader(
  SMProfile,
  "mongosmprofilepic",
  "profilePic",
  {
    message: "Profile Pic Updated",
  }
);

export const updateProfile = updateDocumentByID(SMProfile, {
  message: "Profile Updated",
});

// Friends
export const sendFriendRequest = sendRequest(
  SMProfile,
  SMFriendRequest,
  SMFriends,
  {
    message: "Friend Request Sent",
  }
);

export const acceptFriendRequest = respondToRequest(
  SMProfile,
  SMFriendRequest,
  SMFriends,
  {
    message: "Connected Successfully",
  }
);

// Takes Multiple Images UpTo 5 Of MAX Limit

export const postImages = processDataWithMultipleImage(
  "postImage",
  "mongosmposts",
  5
);
export const addNewPostToSocialMedia = createDocument(SMPost, {
  message: "Post Added",
});

export const postbelongsTo = checkWetherThisBelongsTo(SMPost);

export const deletePost = deleteDocument(SMPost, {
  message: "Post Deleted",
});

// Comment And Like On Post
// Check Wether Post Exits To Avoid Duplicate Comments.

export const checkPostExistToCommentOrLike = checkWetherReferenceExist(SMPost);
export const commentOnPost = createDocument(SMComment, {
  message: "Commented On Post",
});

export const commentBelongsTo = checkWetherThisBelongsTo(SMComment);
export const deleteCommentOfPost = deleteDocument(SMComment, {
  message: "Deleted Comment",
});

export const LikeOnPost = createDocument(SMLike, {
  message: "Liked On Post",
});

export const LikeBelongsTo = checkWetherThisBelongsTo(SMLike);
export const unLikePost = deleteDocument(SMLike, {
  message: "Undo Like Success",
});

// GET My Posts ...
export const getMyProfile = readDocumentByID(SMProfile, {
  message: "Your Profile",
});

// Reply To Comments
export const replyToComment = createDocument(SMReplyCommnet, {
  message: "Replyed To Comment",
});

export const getPostOfMineAndFriends = readAllDocument(SMPost, {
  message: "Your Feed",
});
