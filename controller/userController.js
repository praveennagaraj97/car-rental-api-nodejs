// Model
import { User } from "./../model/userModel";

// user Handler
import {
  signUpUser,
  signInUser,
  forgotUserPassword,
  resetUserPassword,
  updateUserDetails,
  updateLoggedInUserPassword,
  deleteLoggedUser,
  getLoggedUser,
  logOutUser,
  protect,
  restrictTo,
  isLoggedIn,
} from "./../handlers/userHandler";

// Protect Routes
export { signUpChecker } from "./../handlers/userHandler";

export const WhoISloggedIn = isLoggedIn(User);

// Middlewares
export {
  setUserForUpdatingProfilePic,
  preFillForActivatingAccount,
} from "./../middleware/preFillers";

// Stats
import { getCollectionStatistics } from "./../handlers/statsHandler";

import { imageUploader, updateDocumentByID } from "../handlers/factoryHandler";

export const signUp = signUpUser(User, {
  message: "Thank You - registration Successful",
});

export const signIn = signInUser(User, {
  message: "Successfully logged-In",
});

export const forgotPassword = forgotUserPassword(User, {
  message:
    "Reset Successfully Sent To Mail Please Check And Mail and Reset Your Password",
});

export const resetPassword = resetUserPassword(User, {
  message: "Password Changed Succesfully And Logged-In",
});

// Protect Routes
export const protectRoute = protect(User);

export const restrictRoute = restrictTo;

export const updateME = updateUserDetails(User, {
  message: "Profile SuccessFully Updated",
});

export const updateMyPassword = updateLoggedInUserPassword(User, {
  message: "Password Changed Successfully",
});

export const deleteME = deleteLoggedUser(User, {
  message: `Thank You using Our Services.
  Your Account has been Successfully deleted`,
});

export const logOutME = logOutUser(User, {
  message: "Logged Out",
});

export const getMe = getLoggedUser(User, {
  message: "Your Details",
});

export const updateProfilePicture = imageUploader(
  User,
  "mongouserprofile",
  "profilePic",
  {
    message: "Profile Picture Updated",
  }
);

export const activateAccount = updateDocumentByID(User, {
  message: "Account Active",
});

export const getNoOfUsers = getCollectionStatistics(
  "user",
  User,
  {
    accountActive: { $eq: true },
  },
  {
    _id: "USERS USING OUR SERVICES",
    NoOfLoggedInUsers: { $sum: +1 },
  }
);
