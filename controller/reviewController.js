// Model
import { Review } from "../model/reviewModel";

// Handler
import {
  createDocument,
  updateDocumentByID,
  deleteDocument,
  readAllDocument,
  readDocumentByID,
} from "./../handlers/factoryHandler";

// Stats
import { getCollectionStatistics } from "./../handlers/statsHandler";

// Protect Routes
export { protectRoute } from "./../controller/userController";

// Middleware

import { processDataWithSingleImage } from "./../middleware/imageProcessing";
import {
  checkWhetherDocumentExists,
  checkingToWhomDocumentBelongs,
} from "./../middleware/preCheckers";

export {
  preFillerForGettingUser,
  getReviewOfCurrentUser,
} from "./../middleware/preFillers";

// Review Takes Single Image.
export const reviewData = processDataWithSingleImage(
  "photo",
  "mongowebsitereview"
);
export const addReview = createDocument(Review, {
  message: "Review Added",
});

export const getAllReviews = readAllDocument(Review, {
  message: "List Of Reviews",
});

export const reviewBelongsTo = checkingToWhomDocumentBelongs(Review);

export const editReview = updateDocumentByID(Review, {
  message: "Review Successfully Updated",
});

export const deleteReview = deleteDocument(Review, {
  message: "Review Deleted Successfully",
});

export const getMyReview = readAllDocument(Review, {
  message: "Requested Review",
});

// Get The Average Rating Which Will be Shown On Blog Page

export const getReviewsStatistics = getCollectionStatistics(
  "review",
  Review,
  {
    rating: { $gte: 1 },
  },
  {
    _id: "Ratings Count",
    NoOfRating: { $sum: 1 },
    AverageRating: { $avg: "$rating" },
  }
);
