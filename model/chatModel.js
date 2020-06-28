import { Schema, model } from "mongoose";

const chatSchema = new Schema(
  {
    profileId: {
      type: Schema.Types.ObjectId,
    },
    friendId: {
      type: Schema.Types.ObjectId,
    },
    sent: {
      type: [String],
    },
    recieved: {
      type: [String],
    },
  },
  {
    versionKey: false,
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

chatSchema.pre(/^find/, function (next) {
  this.populate({
    path: "profileId",
    model: "SMProfileData",
  }).populate({
    path: "friendId",
    model: "SMProfileData",
  });

  next();
});

export const Chat = model("SMChat", chatSchema);
