import { catchAsyncError } from "./../utils/catchAsyncError";
import { AppError } from "./../utils/appError";
import { ApiFeatures } from "./../utils/apiFeatures";

import { Review } from "./../model/reviewModel";
import { getNoOfUsers } from "./../controller/userController";
import { getReviewsStatistics } from "./../controller/reviewController";

import { Car } from "./../model/carModel";
import { Shop } from "./../model/shopModel";
import { User } from "../model/userModel";

export { protectRoute, WhoISloggedIn } from "./../controller/userController";

// Landing Page / Base Url.
// get Reviews from review Collection
// get Reviews Statistics.
// get No Of Users

// Middleware for Storing UserStats and Review Stats is Required

export const usersStats = getNoOfUsers;
export const reviewStats = getReviewsStatistics;

export const base = catchAsyncError(async (req, res, next) => {
  const review = await Review.find();
  const reviewStats = req.review;
  const usersStats = req.user;

  res.render("base", {
    review,
    reviewStats,
    usersStats,
  });
});

// Car Rental View Controls
export const getAllCars = catchAsyncError(async (req, res, next) => {
  // Get All cars
  req.query.page ? req.query.page : (req.query.page = 1);

  const modelledCar = new ApiFeatures(Car.find(), req.query)
    .filter()
    .limit()
    .paging()
    .sort();

  const car = await modelledCar.queryObj;

  if (!car || car.length < 1) {
    return next(new AppError("No Car Found", 404));
  }

  const page = await Car.estimatedDocumentCount();

  res.render("carRental/carOverview", {
    title: "All Cars",
    car,
    pages: Math.ceil(page / 6),
  });
});

export const getCar = catchAsyncError(async (req, res) => {
  const car = await Car.findOne({ slug: req.params.car.split(":")[1] }).select([
    "+doors",
    "+seats",
    "+min_age",
    "+luggage",
    "+engine",
    "+horsepower",
  ]);

  res.render("carRental/car", { title: "Audi", car });
});

// Shop Renders

export const getAllProducts = catchAsyncError(async (req, res, next) => {
  req.query.page ? req.query.page : (req.query.page = 1);
  const modelledProducts = new ApiFeatures(Shop.find(), req.query)
    .filter()
    .limit()
    .paging()
    .sort();

  const products = await modelledProducts.queryObj;
  const page = await Shop.estimatedDocumentCount();
  res.render("shop/shopOverview", {
    title: "Shop",
    products,
    pages: Math.ceil(page / 6),
  });
});

export const getProduct = catchAsyncError(async (req, res) => {
  const product = await Shop.findOne({
    slug: req.params.part.split(":")[1],
  }).select(["+productDetails", "+productBy"]);
  res.render("shop/eachProduct", { product });
});

// Login /SignUp
export const login = catchAsyncError(async (req, res, next) => {
  res.render("user/login");
});

export const signUp = catchAsyncError(async (req, res, next) => {
  res.render("user/signup");
});

export const logout = catchAsyncError(async (req, res, next) => {
  res.clearCookie("jwt");
  res.render("user/logout");
});

export const activateNewUserAccount = catchAsyncError(
  async (req, res, next) => {
    res.render("user/activateUser");
  }
);

export const getMe = catchAsyncError(async (req, res, next) => {
  res.render("user/me");
});

export const PasswordforgotRequest = catchAsyncError(async (req, res, next) => {
  res.render("user/forgotPasswordRequest");
});

export const forgotPasswordPage = catchAsyncError(async (req, res, next) => {
  res.render("user/passwordforgot");
});

// Chat Router
export const chatPage = catchAsyncError(async (req, res, next) => {
  res.render("chat/chat");
});
