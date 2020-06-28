import { AppError } from "./../utils/appError";
import { catchAsyncError } from "./../utils/catchAsyncError";

import {
  JWTTokenGen,
  JWTTokenVerify,
  JWTTimeStampCheck,
} from "./../utils/jwtPromiseFunctions";

import { Email } from "./../utils/nodeMailer";

const cookieSender = (res, name, value) =>
  res.cookie(name, value, {
    maxAge: Number(process.env.COOKIE_EXPIRES),
    httpOnly: true,
    secure: true,
  });

export const signUpChecker = async (req, res, next) => {
  if (req.body.role) {
    if (!req.body.joinCommunity)
      return next(new AppError("You Cannot Join Our Community", 404));
    if (req.body.joinCommunity != process.env.JOIN_COMMUNITY)
      return next(new AppError("Contact admin for Joining Our Community", 404));
  }
  next();
};

export const signUpUser = (ModelName, responseObj) =>
  catchAsyncError(async (req, res, next) => {
    const user = await ModelName.create(req.body);
    if (!user) return next(new AppError("Registration Not Successful", 500));

    // Url Is TO Confirm Account
    const url = `${req.protocol}://${req.get(
      "host"
    )}/v1/ExploreDreamDiscover/activate/${user._id}`;
    await new Email(user, url).sendWelcome();

    const token = await JWTTokenGen(user._id);
    cookieSender(res, "jwt", token);
    req.loggedUser = user;

    responseObj.details = user;
    responseObj.token = token;
    responseObj.url = url;
    res.status(201).json(responseObj);
  });

export const signInUser = (ModelName, responseObj) =>
  catchAsyncError(async (req, res, next) => {
    const user = await ModelName.findOne({ email: req.body.email }).select(
      "+password"
    );
    if (!user) {
      return next(new AppError(`No User Found With Email ${req.body.email}`));
    }
    if (
      !user ||
      !(await user.passwordVerify(req.body.password, user.password))
    ) {
      return next(new AppError("Incorrect Password Entered", 404));
    }

    const token = await JWTTokenGen(user._id);
    cookieSender(res, "jwt", token);

    responseObj.details = user;

    responseObj.token = token;
    res.status(200).json(responseObj);
  });

export const forgotUserPassword = (ModelName, responseObj) =>
  catchAsyncError(async (req, res, next) => {
    const user = await ModelName.findOne({ email: req.body.email });
    if (!user)
      return next(
        new AppError(`${req.body.email} is Not Registered Please SignUp`, 500)
      );

    const token = await JWTTokenGen(user._id, 60 * 10);

    const resetUrl = `{{URL}}/user/resetPassword/${token}`;
    const resetUrlMail = `${req.protocol}://${req.get(
      "host"
    )}/v1/ExploreDreamDiscover/resetPassword/${token}`;

    await new Email(user, resetUrlMail).sendPasswordReset();

    responseObj.resetUrl = resetUrl;
    res.status(200).json(responseObj);
  });

// Reset takes jwt token that was sent and verify the token and it's timestamp.
// One it's correct it will find id of user from jwt and updates there password.

export const resetUserPassword = (ModelName, responseObj) =>
  catchAsyncError(async (req, res, next) => {
    const decode = await JWTTokenVerify(req.params.token);

    const check = await JWTTimeStampCheck(decode.iat, decode.exp);

    if (!check) return next(new AppError("Password Reset Token Expired", 500));

    const user = await ModelName.findOne({ _id: decode.id }).select(
      "+password +confirmPassword"
    );

    if (req.body.password !== req.body.confirmPassword)
      return next(
        new AppError("Password and Confirm Password Didn't match", 500)
      );

    user.password = req.body.password;

    user.confirmPassword = req.body.password;

    await user.save();

    const token = await JWTTokenGen(user._id);
    cookieSender(res, "jwt", token);
    responseObj.user = user;
    responseObj.token = token;

    res.status(200).json(responseObj);
  });

// Will Check Whether User is Logged In Or Not Using Bearer-Token and JWt verify
export const protect = (ModelName) =>
  catchAsyncError(async (req, res, next) => {
    if (
      !req.headers.authorization ||
      !req.headers.authorization.startsWith("Bearer")
    ) {
      if (!req.cookies.jwt)
        return next(new AppError("You Are Not Logged In Please Log-In", 401));
    }
    const token = req.cookies.jwt
      ? req.cookies.jwt
      : req.headers.authorization.split(" ")[1];

    const decode = await JWTTokenVerify(token);
    if (!decode) return next(new AppError(`This ${token} is Invalid`));

    const timeStampCheck = await JWTTimeStampCheck(decode.iat, decode.exp);

    if (!timeStampCheck) return next(new AppError("Please Log In Again", 401));

    const loggedUser = await ModelName.findById({ _id: decode.id });

    if (!loggedUser) return next(new AppError("User Doesn't Exist", 404));

    if (loggedUser.isPasswordModified(decode.iat))
      return next(new AppError("Please Login Again"));

    req.loggedUser = loggedUser;
    res.locals.user = loggedUser;

    next();
  });

// Restrict-To will Restrict Some Routers restricted for Other Users
// This Will Be Used In Router
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (roles.includes(req.loggedUser.role)) next();
    else next(new AppError("You Are Not Allowed to this Operation", 404));
  };
};

// Update My Password after LoggedIn
export const updateLoggedInUserPassword = (ModelName, responseObj) =>
  catchAsyncError(async (req, res, next) => {
    const user = await ModelName.findById(req.loggedUser._id).select(
      "+password"
    );
    const passwordcheck = await user.passwordVerify(
      req.body.currentPassword,
      user.password
    );
    if (!passwordcheck) {
      res.token = undefined;
      res.cookie("JWT", undefined);
      return next(
        new AppError(
          `You Are Not Authorized TO Change Password Logging You Out For Security Purpose`,
          404
        )
      );
    }

    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;

    await user.save();
    responseObj.status = `Your New Password is ${req.body.password}`;
    res.status(202).json(responseObj);
  });

// Update User Details After Logged-In (Which will allow for Booking)

export const updateUserDetails = (ModelName, responseObj) =>
  catchAsyncError(async (req, res, next) => {
    if (req.body.role) {
      if (!req.body.joinCommunity)
        return next(new AppError("You Cannot Join Our Community", 404));
      if (req.body.joinCommunity != process.env.JOIN_COMMUNITY)
        return next(
          new AppError("Contact admin for Joining Our Community", 404)
        );
    }

    if (req.body.password)
      return next(
        new AppError(
          "You Are Not Allowed To Change Password Here Please Use Change Password Option",
          403
        )
      );

    if (req.body.drivingLicence) req.body.bookingAccess = true;

    const user = await ModelName.findByIdAndUpdate(
      req.loggedUser._id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    responseObj.updatedValues = req.body;
    responseObj.updatedDetails = user;
    res.status(202).json(responseObj);
  });

export const getLoggedUser = (ModelName, responseObj) =>
  catchAsyncError(async (req, res, next) => {
    const user = await ModelName.findById(req.loggedUser._id).select(
      "+bookingHistory"
    );
    (responseObj.details = user), res.status(200).json(responseObj);
  });

export const deleteLoggedUser = (ModelName, responseObj) =>
  catchAsyncError(async (req, res, next) => {
    await ModelName.findByIdAndDelete(req.loggedUser._id);
    res.status(202).json(responseObj);
  });

export const logOutUser = (ModelName, responseObj) =>
  catchAsyncError(async (req, res, next) => {
    await ModelName.findById(req.loggedUser._id);

    res.clearCookie("jwt");
    responseObj.token = undefined;

    res.status(200).json(responseObj);
  });

// Render - Mode Only

export const isLoggedIn = (ModelName) => async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    const decode = await JWTTokenVerify(token);

    await JWTTimeStampCheck(decode.iat, decode.exp);

    const loggedUser = await ModelName.findById({ _id: decode.id });
    if (loggedUser) res.locals.user = loggedUser;
    next();
  } catch (err) {
    next();
  }
};
