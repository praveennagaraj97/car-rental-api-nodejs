import { Schema, model } from "mongoose";

const hotelReviewSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reviewImages: [String],
    hotelId: {
      type: Schema.Types.ObjectId,
      ref: "Hotel",
    },
    locationRating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "Enter the Location Rating for Hotel"],
    },
    sleepRating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "Enter the Sleep Rating for Hotel"],
    },
    roomRating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "Enter the Room Rating for Hotel"],
    },
    serviceRating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "Enter the Service Rating for Hotel"],
    },
    valueRating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "Enter the value Rating for Hotel"],
    },
    cleanlinessRating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "Enter the Cleanliness Rating for Hotel"],
    },
    comment: {
      type: String,
      trim: true,
      required: [true, "Enter the Contact FirstName"],
    },
    avgRating: {
      type: Number,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

hotelReviewSchema.pre("save", function (next) {
  this.avgRating =
    (this.locationRating +
      this.sleepRating +
      this.roomRating +
      this.serviceRating +
      this.valueRating +
      this.cleanlinessRating) /
    6;

  next();
});

hotelReviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "userId",
    model: "User",
  }).populate({
    path: "hotelId",
    model: "Hotel",
  });

  next();
});

export const hotelReview = model("hotelReview", hotelReviewSchema);
