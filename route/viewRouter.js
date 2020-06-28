import { Router } from "express";

import {
  // Rent Car
  getCar,
  getAllCars,
  //Landing Page /Blog Attached With Static Page
  base,

  // Shop Parts
  getAllProducts,

  // User
  login,
  signUp,
  logout,
  getMe,
  activateNewUserAccount,
  forgotPasswordPage,
  PasswordforgotRequest,
  chatPage,

  // Middlewares
  protectRoute,
  WhoISloggedIn,
  getProduct,
} from "./../controller/viewController";

import { createBookingCheckOut } from "./../controller/bookingController";

import { chatConnection } from "./../controller/chatController";

export const viewRouter = Router();

viewRouter.use(WhoISloggedIn);
// Base Route
viewRouter.route("/").get(createBookingCheckOut, base);

// Rental Car Routes
viewRouter.route("/rentcar").get(getAllCars);

viewRouter.route("/rentcar/:car").get(getCar);

// Shop Car Parts Routes

viewRouter.route("/buyparts").get(getAllProducts);

viewRouter.route("/buyparts/:part").get(getProduct);

// Login /SignUp

viewRouter.route("/login").get(login);

viewRouter.route("/joinus").get(signUp);

viewRouter.route("/logout").get(protectRoute, logout);

viewRouter.route("/me").get(protectRoute, getMe);

viewRouter.route("/activate/:id").get(activateNewUserAccount);

viewRouter.route("/resetPassword/:token").get(forgotPasswordPage);

viewRouter.route("/passwordresetRequest").get(PasswordforgotRequest);

// Chat
viewRouter.route("/chat").get(chatPage);
