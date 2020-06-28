import { Schema, model } from "mongoose";

import { isPast } from "date-fns";
import moment from "moment";

const todoSchema = new Schema({
  todoTitle: {
    type: String,
    default: "Untitled ToDo",
  },
  todoDescription: {
    type: String,
    required: ["Please Enter Description of What You What to DO."],
  },
  whichDate: {
    type: Date,
    validate: {
      validator: function (val) {
        return !isPast(val);
      },
      message: "You Are Allowed to Enter Task in Past",
    },
    required: true,
  },
  whatTime: {
    type: Date,
    required: true,
  },

  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
});

todoSchema.pre("save", function (next) {
  this.whichDate = undefined;
  next();
});

todoSchema.pre(/^find/, function (next) {
  this.find({ whatTime: { $gte: new Date().toISOString() } });

  this.populate({
    path: "userId",
    model: "User",
    select: "profilePic",
  });

  next();
});

export const ToDo = model("ToDo", todoSchema);
