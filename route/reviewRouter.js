import { Router } from "express";

import {
  addReview,
  getAllReviews,
  getReviewsStatistics,
  protectRoute,
  getMyReview,
  editReview,
  deleteReview,

  // Middlware
  reviewData,
  preFillerForGettingUser,
  reviewBelongsTo,
  getReviewOfCurrentUser,
} from "../controller/reviewController";

export const reviewRouter = Router();

// To add a review about our website which will be displayed under blogpage
// user has to be logged-In and must have booking history
// 1 booking will give access to one review.

reviewRouter
  .route("/addReview")
  .post(protectRoute, preFillerForGettingUser, reviewData, addReview);

reviewRouter.route("/getReviews").get(getAllReviews);

reviewRouter
  .route("/getMyReview")
  .get(protectRoute, getReviewOfCurrentUser, getMyReview);

reviewRouter
  .route("/updateReview/:id")
  .patch(protectRoute, reviewBelongsTo, editReview);

reviewRouter
  .route("/deleteReview/:id")
  .delete(protectRoute, reviewBelongsTo, deleteReview);

// No OF reviews Stats
reviewRouter.route("/getNoOfReviews").get(getReviewsStatistics);
