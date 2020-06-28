// Model
import { Car, AttachCar } from "./../model/carModel";

// Handler
import {
  createDocument,
  updateDocumentByID,
  deleteDocument,
  readAllDocument,
  readDocumentByID,

  // Advanced
  imageUploader,
} from "./../handlers/factoryHandler";

// Business Handler / Stats Handler
import { getCollectionStatistics } from "./../handlers/statsHandler";

// Protect Routes
export { protectRoute, restrictRoute } from "./userController";

// Image Process
import {
  processDataWithSingleImage,
  processDataWithMultipleImage,
} from "./../middleware/imageProcessing";

import { checkWhetherDocumentExists } from "../middleware/preCheckers";

// Only Admin/Employee Can Add A Car
export const processDataForAddingNewCar = processDataWithSingleImage(
  "carCoverImage",
  "mongocarrentalcover"
);

export const addNewCar = createDocument(Car, {
  message: "New Car Added",
});

export const updateCarImageCover = imageUploader(
  Car,
  "mongocarrentalcover",
  "carCoverImage",
  {
    message: "Image Added To Car",
  }
);

export const getAllCarData = readAllDocument(Car, {
  message: "Cars Details",
});

export const getCar = readDocumentByID(
  Car,
  {
    message: "Details Of The Car",
  },
  [
    "+engine",
    "+horsepower",
    "+doors",
    "+seats",
    "+transmission",
    "+min_age",
    "+luggage",
    "+luggage",
    "+fuelType",
    "+fuelEconomy",
    "-__v",
  ]
);

export const updateCarDetails = updateDocumentByID(Car, {
  message: "Car Details Updated",
});

export const deleteCar = deleteDocument(Car, {
  message: "One Car is Deleted",
});

// Attaching Cars To The Available Car List

export const processDataForAttachingCar = processDataWithMultipleImage(
  "carImages",
  "mongoattachedcars",
  5
);

export const checkCarIdExist = checkWhetherDocumentExists(Car, "carId");

export const attachCar = createDocument(AttachCar, {
  message: "Car Attached Successfully",
});

export const deleteAttachedCar = deleteDocument(AttachCar, {
  message: "Car Detached",
});

/* 
Car Stats Will Provide ::::::
    Number Of cars In Each Car Type.
    Max Price of the Car.
    Min Price of the Car.
    Average Price of the Car.

*/

// // Statistics
export const getCarStatistics = getCollectionStatistics(
  "car",
  Car,
  {
    condition: { $eq: true },
  },
  {
    _id: { $toUpper: "$carType" },
    NoOfCarBrands: { $sum: +1 },
    avgPrice: { $avg: "$price" },
    minPrice: { $min: "$price" },
    maxPrice: { $max: "$price" },
  }
);
