import {
  createDocument,
  readAllDocument,
  readDocumentByID,
  updateDocumentByID,
  deleteDocument,
  imageUploader,
} from "./../handlers/factoryHandler";

import { Hotel, Room, Manager } from "./../model/hotelModel";
// import { hotelReview } from "./../model/hotelReviewModel";

//Security access

export { protectRoute } from "./userController";

// Middlewares
import { checkWhetherDocumentExists } from "../middleware/preCheckers";
import {
  processDataWithSingleImage,
  processDataWithMultipleImage,
} from "./../middleware/imageProcessing";

export const doesHotelExist = checkWhetherDocumentExists(Hotel, "hotelId");

//Hotel
export const processHotelDataWithImage = processDataWithSingleImage(
  "hotelImage",
  "mongohotelimages"
);
export const createHotel = createDocument(Hotel, {
  message: "Hotel Data Has Been added , Thank You",
});

export const updateHotel = updateDocumentByID(Hotel, {
  message: "Hotel Data Has Been Update , Thamk You",
});

export const deleteHotel = deleteDocument(Hotel, {
  message: "Hotel Data Has Been Deleted, Come Again",
});

export const viewHotel = readAllDocument(Hotel, {
  message: "List Of Hotels",
});

export const viewHotelWithRooms = readDocumentByID(Hotel, {
  message: "Requested Hotel",
});

//room
export const processRoomDataWithImages = processDataWithMultipleImage(
  "roomImages",
  "mongohotelrooms",
  5
);

export const createRoom = createDocument(Room, {
  message: "Room Data Has Been added , Thank You",
});

export const updateRoom = updateDocumentByID(Room, {
  message: "Room Data Has Been Update , Thamk You",
});

export const deleteRoom = deleteDocument(Room, {
  message: "Room Data Has Been Deleted",
});

export const viewRoom = readAllDocument(Room, {
  message: "List Of Rooms",
});

//Manager

export const createManager = createDocument(Manager, {
  message: "Manager Detail Added",
});

export const deleteManager = deleteDocument(Manager, {
  message: "Manager Detail Deleted",
});
