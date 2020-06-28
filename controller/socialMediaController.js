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
import { catchAsyncError } from "../utils/catchAsyncError";
import { AppError } from "../utils/appError";
import { id } from "date-fns/locale";

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

export const getMyFriends = catchAsyncError(async (req, res, next) => {
  const currentUserProfileId = await SMProfile.findOne({
    userId: req.loggedUser._id,
  });

  const friends = await SMFriends.find({
    friends: { $all: [currentUserProfileId._id] },
  });

  const friendList = [];
  // Filter Friends
  friends.forEach((el) => {
    if (String(el.friends[0]) == String(currentUserProfileId._id)) {
      friendList.push(el.friends[1]);
    }
  });

  const result = [];
  for (let each of friendList) {
    const friendsDetail = await SMProfile.findById(each).select("-userId");
    result.push(friendsDetail);
  }
  if (result.length < 1) return next(new AppError("No Friends Found", 200));

  res.status(200).json({
    result,
  });
});

export const getAllSocialMediaUser = catchAsyncError(async (req, res, next) => {
  const user = await SMProfile.find({
    userId: { $ne: req.loggedUser._id },
  }).select("-userId");

  if (!user) return next(new AppError("Sorry No users Found", 500));

  res.status(200).json(user);
});

export const getFriendsStatus = catchAsyncError(async (req, res, next) => {
  // console.log(req.body);
  const status = await SMFriends.findOne({
    friends: [req.body.profileId, req.body.friend],
  });

  if (!status) return next(new AppError("Not Friends", 400));

  res.status(200).json({
    data: status,
    status: "Friends",
  });
});
