import {
  signUp,
  signIn,
  forgotPassword,
  resetPassword,
  protectRoute,
  updateME,
  updateMyPassword,
  deleteME,
  logOutME,
  getMe,
  getNoOfUsers,
  updateProfilePicture,
  activateAccount,

  // Protect Routes
  signUpChecker,
  restrictRoute,

  // Middleware
  setUserForUpdatingProfilePic,
  preFillForActivatingAccount,
} from "./../controller/userController";

import { Router } from "express";

export const userRouter = Router();

userRouter.route("/signUp").post(signUpChecker, signUp);

userRouter.route("/login").post(signIn);

userRouter.route("/forgetPassword").post(forgotPassword);

userRouter.route("/resetPassword/:token").patch(resetPassword);

userRouter.route("/updateMe").patch(protectRoute, updateME);

userRouter.route("/getMe").get(protectRoute, getMe);

userRouter.route("/updateMyPassword").patch(protectRoute, updateMyPassword);

userRouter.route("/deleteMe").delete(protectRoute, deleteME);

userRouter.route("/logoutMe").post(protectRoute, logOutME);

userRouter
  .route("/activate/:id")
  .post(preFillForActivatingAccount, activateAccount);

userRouter
  .route("/updateProfilePic")
  .post(protectRoute, setUserForUpdatingProfilePic, updateProfilePicture);

// Get No Of Users.

userRouter.route("/getUsersStats").get(getNoOfUsers);
