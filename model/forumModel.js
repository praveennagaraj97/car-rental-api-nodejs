import { Schema, model } from "mongoose";

// Handled By Admin - Authors(verified Users to post event and news)
const postSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Please Enter Title for the Post"],
      unique: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    post: {
      type: String,
      trim: true,
      required: [true, "Please Enter Post Details"],
    },
    postImages: {
      type: [String],
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
    versionKey: false,
  }
);

postSchema.virtual("comments", {
  ref: "ForumComment",
  localField: "_id",
  foreignField: "postId",
});

postSchema.pre("find", function (next) {
  this.populate({
    path: "userId",
    select: "profilePic username _id",
  });
  next();
});

postSchema.pre("findOne", function (next) {
  this.populate({
    path: "userId",
    select: "profilePic username _id",
  }).populate({
    path: "comments",
  });
  next();
});

// Logged-In Users Only
const commentSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  postId: {
    type: Schema.Types.ObjectId,
    ref: "ForumPost",
    required: true,
  },
  commentedDate: {
    type: Date,
    default: Date.now,
  },
  comment: {
    type: String,
    required: [true, "Please Enter the Comment"],
    trim: true,
  },
});

commentSchema.pre(/^find/, function (next) {
  this.populate({
    path: "userId",
    select: "profilePic username",
  });
  next();
});

export const ForumPost = model("ForumPost", postSchema);

export const ForumComment = model("ForumComment", commentSchema);
