import { Router } from "express";

import {
  // Image Process
  processDataForAddingNewCar,
  processDataForAttachingCar,

  //Checkers
  checkCarIdExist,
  // Admin / Employee
  addNewCar,
  getAllCarData,
  updateCarDetails,
  deleteCar,
  getCar,

  //
  attachCar,
  updateCarImageCover,
  deleteAttachedCar,

  // Protect Routes
  protectRoute,
  restrictRoute,
  getCarStatistics,
} from "./../controller/carController";

export const carRouter = Router();

carRouter
  .route("/addNewCar")
  .post(
    protectRoute,
    restrictRoute("admin", "employee"),
    processDataForAddingNewCar,
    addNewCar
  );

carRouter
  .route("/updateCarCoverImage/:id")
  .patch(protectRoute, restrictRoute("admin", "employee"), updateCarImageCover);

carRouter.route("/getAllCar").get(getAllCarData);

carRouter
  .route("/updateCarDetails/:id")
  .patch(protectRoute, restrictRoute("admin", "employee"), updateCarDetails);

carRouter
  .route("/deleteCar/:id")
  .delete(protectRoute, restrictRoute("admin", "employee"), deleteCar);

carRouter.route("/getCar/:id").get(getCar);

// Attach Cars
// Takes 5 Images dashboard/Front/left/Right/back
carRouter
  .route("/attachCar")
  .post(
    protectRoute,
    restrictRoute("admin", "employee"),
    checkCarIdExist,
    processDataForAttachingCar,
    attachCar
  );

carRouter
  .route("/detachCar/:id")
  .delete(protectRoute, restrictRoute("admin", "employee"), deleteAttachedCar);

carRouter.route("/getCarStats").get(getCarStatistics);
