import { Schema, model } from "mongoose";

// Review On Website Which will be displayed On Blog Page
const reviewSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "A review Must Have Reviewer"],
    },
    reviewTitle: {
      type: String,
      trim: true,
      unique: true,
      required: [true, "Please Enter Review Title"],
      validate: {
        validator: function (val) {
          return val.length < 70;
        },
        message: "Please Enter Title Of less than 70 Character Only",
      },
    },
    review: {
      type: String,
      trim: true,
      unique: true,
      required: [true, "Please Enter Review"],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "Please Enter Rating "],
    },
    photo: {
      type: String,
      required: [true, "Please Add an Image For The Review"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
    versionKey: false,
  }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "userId",
    select: "profilePic username",
  });
  next();
});

export const Review = model("Review", reviewSchema);
