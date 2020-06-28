import { Schema, model } from "mongoose";

import { isURL } from "validator";

/*@model - 
Media Has List Of Other Users When Someone Sends Request Other Should Accept it
User Details Has To Be Displayed In Separate Route From Where User Can Choose And Send Request.
        While Sending User Can View Only Profile Pic And Fewe Basics Details.
/@@NewUser Model Is Needed Which Has To Be referenced to main User Model.


*/

// Social Media Details
// This Model Should Be Linked TO Main User Model
const SMprofileDataSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
      ref: "User",
    },
    profilePic: {
      type: String,
      required: true,
    },

    profileName: {
      type: String,
      required: true,
      unique: true,
    },
    bio: {
      type: String,
    },
    //Set This to Unique
    userWebsite: {
      type: String,
      validate: [isURL, "Enter Valid Url"],
    },
  },
  {
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const SMpostSchema = new Schema(
  {
    profileId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    postImage: {
      type: [String],
      required: true,
    },
    caption: {
      type: String,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

SMpostSchema.virtual("comments", {
  ref: "SMComments",
  localField: "_id",
  foreignField: "postId",
});

SMpostSchema.virtual("likes", {
  ref: "SMLikes",
  localField: "_id",
  foreignField: "postId",
  justOne: false,
  count: true,
});

SMpostSchema.pre(/^find/, function (next) {
  this.populate({
    path: "comments",
    select: "comment",
  })
    .populate({
      path: "profileId",
      model: "SMProfileData",
      select: "profileName",
    })
    .populate({
      path: "likes",
    });

  next();
});

const SMcommentSchema = new Schema(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: "SMPost",
      required: true,
    },
    profileId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

SMcommentSchema.virtual("replies", {
  ref: "SMReplyComment",
  localField: "_id",
  foreignField: "commentId",
});

SMcommentSchema.pre(/^find/, function (next) {
  this.populate({
    path: "profileId",
    model: "SMProfileData",
    select: "profileName",
  }).populate({
    path: "replies",
  });

  next();
});

const SMreplyOnCommentSchema = new Schema(
  {
    commentId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    profileId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    versionKey: false,
    timestamps: true,
  }
);

SMreplyOnCommentSchema.pre(/^find/, function (next) {
  this.populate({
    path: "profileId",
    model: "SMProfileData",
    select: "profileName",
  });

  next();
});

const SMLikeSchema = new Schema(
  {
    postId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    profileId: {
      type: Schema.Types.ObjectId,
      required: true,
      // Unique doesn't Work
      // During Input It's String
      // Once Saved It's Object -
      // So unique finds there is no string.
      validate: {
        validator: async function (val) {
          const data = await SMLike.find({ profileId: val });
          return data.length === 0 ? true : false;
        },
        message: "You Already Liked This Post",
      },
    },
    like: {
      type: Boolean,
      default: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const SMfriendsRequestSchema = new Schema({
  profileId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  friendId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  friends: {
    type: [Schema.Types.ObjectId],
  },
});

SMfriendsRequestSchema.pre("save", function (next) {
  this.friends[0] = this.profileId;
  this.friends[1] = this.friendId;

  this.friendId = undefined;
  this.profileId = undefined;
  next();
});

// Once Accepted Friend ID Will be added Here And Above Request Has TO Be Deleted.
const SMfriendsSchema = new Schema(
  {
    profileId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    friendId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    friends: {
      type: [Schema.Types.ObjectId],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

SMfriendsSchema.pre("save", async function (next) {
  this.friends[0] = this.profileId;
  this.friends[1] = this.friendId;

  this.friendId = undefined;
  this.profileId = undefined;
  next();
});

// Chat Section Is Remaining

export const SMProfile = model("SMProfileData", SMprofileDataSchema);
export const SMPost = model("SMPost", SMpostSchema);
export const SMComment = model("SMComments", SMcommentSchema);
export const SMReplyCommnet = model("SMReplyComment", SMreplyOnCommentSchema);
export const SMLike = model("SMLikes", SMLikeSchema);
export const SMFriendRequest = model("SMFriendRequest", SMfriendsRequestSchema);
export const SMFriends = model("SMFriends", SMfriendsSchema);
