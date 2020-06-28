import { Router } from "express";

export const hotelReviewRouter = Router();

import {
  createHotelReview,
  deleteHotelReview,
  viewHotelReviews,
  // Protect Access
  protectRoute,
  restrictRoute,

  // Middleware
  doesHotelExist,
  preFillerForGettingUser,
  processHotelReviewData,
} from "./../controller/hotelReviewController";

//review
hotelReviewRouter.route("/addReview/:id").post(
  protectRoute,
  restrictRoute("user", "admin"),
  //Middleware to check hotel existance so user can review for that hotel.
  doesHotelExist,
  preFillerForGettingUser,
  processHotelReviewData,
  createHotelReview
);

hotelReviewRouter
  .route("/deleteReview/:id")
  .delete(
    protectRoute,
    restrictRoute("admin", "hotel_owner", "employee"),
    deleteHotelReview
  );

hotelReviewRouter.route("/viewReview").get(viewHotelReviews);
