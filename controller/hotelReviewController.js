import { hotelReview } from "../model/hotelReviewModel";

// Factory
import {
  createDocument,
  readAllDocument,
  deleteDocument,
} from "../handlers/factoryHandler";
import { processDataWithMultipleImage } from "../middleware/imageProcessing";

// Protect Access
export { protectRoute, restrictRoute } from "../controller/userController";
export { doesHotelExist } from "./hotelController";

// Middleware
export { preFillerForGettingUser } from "./../middleware/preFillers";

//Review
export const processHotelReviewData = processDataWithMultipleImage(
  "reviewImages",
  "mongohotelreviews",
  5
);
export const createHotelReview = createDocument(hotelReview, {
  message: "Review Submitted , Thank You",
});

export const viewHotelReviews = readAllDocument(hotelReview, {
  message: "List Of Review Submitted , Thank You",
});

export const deleteHotelReview = deleteDocument(hotelReview, {
  message: "Review Delted",
});
