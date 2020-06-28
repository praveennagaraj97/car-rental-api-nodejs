import { Router } from "express";

import {
  //Hotel Function
  createHotel,
  viewHotel,
  doesHotelExist,
  updateHotel,
  deleteHotel,
  viewHotelWithRooms,
  //Manager Function
  createManager,
  deleteManager,
  //Room Fuction
  createRoom,
  viewRoom,
  updateRoom,
  deleteRoom,
  //Review Function
  createHotelReview,
  viewHotelReview,
  viewHotelReviews,
  doesReviewExist,
  deleteHotelReview,
  //security access
  protectRoute,

  // Middleware
  processHotelDataWithImage,
  processRoomDataWithImages,
} from "./../controller/hotelController";

import { restrictTo } from "./../handlers/userHandler";

export const hotelRouter = Router();

//Hotel
hotelRouter
  .route("/addHotel")
  .post(
    protectRoute,
    restrictTo("admin", "hotel_owner", "employee"),
    processHotelDataWithImage,
    createHotel
  );

hotelRouter
  .route("/updateHotel/:id")
  .patch(
    protectRoute,
    restrictTo("admin", "hotel_owner", "employee"),
    updateHotel
  );

hotelRouter
  .route("/deleteHotel/:id")
  .delete(
    protectRoute,
    restrictTo("admin", "hotel_owner", "employee"),
    deleteHotel
  );

hotelRouter.route("/viewHotel/:id").get(viewHotelWithRooms);

hotelRouter.route("/viewHotels").get(viewHotel);

//Room
hotelRouter.route("/addRoom").post(
  protectRoute,
  restrictTo("admin", "hotel_owner", "employee"),
  //Middleware to check hotel existance
  doesHotelExist,
  processRoomDataWithImages,
  createRoom
);

hotelRouter
  .route("/updateRoom/:id")
  .patch(
    protectRoute,
    restrictTo("admin", "hotel_owner", "employee"),
    updateRoom
  );

hotelRouter
  .route("/deleteRoom/:id")
  .delete(
    protectRoute,
    restrictTo("admin", "hotel_owner", "employee"),
    deleteRoom
  );

//Manager

hotelRouter
  .route("/addManager")
  .post(
    protectRoute,
    restrictTo("admin", "hotel_owner", "employee"),
    createManager
  );

hotelRouter
  .route("/deleteManager/:id")
  .delete(
    protectRoute,
    restrictTo("admin", "hotel_owner", "employee"),
    deleteManager
  );
