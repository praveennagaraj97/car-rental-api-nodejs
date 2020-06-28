import { Schema, model } from "mongoose";
import { isAlpha, isEmail } from "validator";
import { hash, genSalt, compare } from "bcryptjs";

import { locationFinder } from "./../utils/geoLocations";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Please Enter Name"],
      validate: [isAlpha, "Name Cannot Be Empty"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Please Enter Email"],
      validate: {
        validator: function (val) {
          return isEmail(val);
        },
        message: "Enter Correct Email",
      },
    },
    phone: {
      type: Number,
      required: [true, "Please Enter phone Number"],
      validate: {
        validator: function (val) {
          return String(val).length === 10 && String(val).charAt(0) >= 6;
        },
        message: "Enter A Valid Mobile Number",
      },
    },
    password: {
      type: String,
      required: [true, "Please Provide Password"],
      select: false,
    },
    confirmPassword: {
      type: String,
      required: [true, "Please Enter Confirm Password"],
      validate: {
        validator: function (val) {
          return val === this.password;
        },
        message: "Password Didn't Match",
      },
    },
    role: {
      type: String,
      enum: ["user", "admin", "author", "event_manager", "employee", "seller"],
      default: "user",
    },
    drivingLicence: {
      type: String,

      validate: {
        validator: function (val) {
          return String(val).length === 13;
        },
        message: "Please Enter 13 Digit Driving Licence Number",
      },
    },
    profilePic: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Others"],
    },
    dateOfBirth: {
      type: Date,
    },

    passwordModified: Date,
    //Booking access will be given on successful DL verification
    bookingAccess: {
      type: Boolean,
      default: false,
    },
    accountActive: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.virtual("currentLocation").get(function () {
  try {
    return locationFinder();
  } catch (error) {
    return "Please Enable Location Service.";
  }
});

// Difference in mm is calculated by dividing with 31557600000
userSchema.virtual("age").get(function () {
  return this.dateOfBirth
    ? Math.floor((new Date() - this.dateOfBirth) / 31557600000)
    : undefined;
});

userSchema.pre(`save`, async function () {
  this.profilePic =
    "https://cdn.iconscout.com/icon/free/png-512/avatar-370-456322.png";

  const salt = await genSalt(12);
  const hashed = await hash(this.password, salt);
  this.password = hashed;
  this.confirmPassword = undefined;
});

userSchema.methods.passwordVerify = async function (inputPassword, DBPassword) {
  return await compare(inputPassword, DBPassword);
};

userSchema.methods.isPasswordModified = function (JWTTimeStamp) {
  if (this.passwordModified) {
    return parseInt(this.passwordModified.getTime() / 1000, 10) > JWTTimeStamp;
  }
  return false;
};

userSchema.pre(/^find/, function (next) {
  this.find({ accountActive: { $ne: false } });

  next();
});

userSchema.pre("findOneAndUpdate", function (next) {
  this.find({ accountActive: { $ne: true } });

  next();
});

export const User = model("User", userSchema);
