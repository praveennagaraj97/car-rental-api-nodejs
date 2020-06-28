import { catchAsyncError } from "./../utils/catchAsyncError";
import { AppError } from "../utils/appError";

import { AttachCar } from "../model/carModel";
import { Room } from "../model/hotelModel";
import { Shop } from "../model/shopModel";
import { Booking, CarPartBooking } from "../model/bookingModel";
import { User } from "../model/userModel";

export { protectRoute } from "./userController";
export { checkoutSession } from "../handlers/bookingHandler";

// Car Booking Controller
export const CarBooking = catchAsyncError(async (req, res, next) => {
  const car = await AttachCar.findById(req.params.id);
  if (!car || car.length < 1)
    next(new AppError("Car Is Not Available Please Choose Other Car", 200));
  const success_url = `${req.protocol}://${req.get(
    "host"
  )}/v1/ExploreDreamDiscover?car=${car._id}&user=${req.loggedUser._id}&price=${
    car.carId.price
  }`;

  const cancel_url = `${req.protocol}://${req.get(
    "host"
  )}/v1/ExploreDreamDiscover/rentcar`;

  const client_reference_id = req.params.id;
  const line_items = {
    name: `${car.carId.carname}`,
    description: `Car With NumberPlate : ${car.numberPlate}`,
    images: [car.carId.carCoverImage],
    amount: car.carId.price * 100,
    currency: "inr",
    quantity: 1,
  };

  req.success_url = success_url;
  req.cancel_url = cancel_url;
  req.client_reference_id = client_reference_id;
  req.line_items = line_items;
  next();
});

// Parts Booking
export const partBooking = catchAsyncError(async (req, res, next) => {
  const part = await Shop.findById(req.params.id);
  if (!part || part.length < 1)
    next(new AppError("Car Is Not Available Please Choose Other Car", 200));
  const success_url = `${req.protocol}://${req.get(
    "host"
  )}/v1/ExploreDreamDiscover?part=${part._id}&user=${
    req.loggedUser._id
  }&price=${part.partPrice}`;

  const cancel_url = `${req.protocol}://${req.get(
    "host"
  )}/v1/ExploreDreamDiscover/buyparts`;

  const client_reference_id = req.params.id;
  const line_items = {
    name: `${part.partName}`,
    description: `Description: ${part.productDetails}`,
    images: [part.productImages[0]],
    amount: part.partPrice * 100,
    currency: "inr",
    quantity: 1,
  };

  req.success_url = success_url;
  req.cancel_url = cancel_url;
  req.client_reference_id = client_reference_id;
  req.line_items = line_items;

  next();
});

// Hotel Booking
export const hotelBooking = catchAsyncError(async (req, res, next) => {
  const hotel = await Room.findById(req.params.roomId);
  if (!hotel || hotel.length < 1)
    next(new AppError("Room Is Not Available", 200));

  const success_url = `${req.protocol}://${req.get(
    "host"
  )}/v1/ExploreDreamDiscover?hotelname=${hotel.hotelId.hotelName}&user=${
    req.loggedUser._id
  }&price=${hotel.roomCost}`;

  const cancel_url = `${req.protocol}://${req.get(
    "host"
  )}/v1/ExploreDreamDiscover/hotel`;

  const client_reference_id = req.params.roomId;
  const line_items = {
    name: `${hotel.hotelId.hotelName}`,
    description: `Address : ${hotel.hotelId.hotelAddress}
    Room-Type : ${hotel.roomType}
    Guest : ${hotel.totalNumOfRoom}`,
    images: [hotel.hotelId.hotelImage],
    amount: hotel.roomCost * 100,
    currency: "inr",
    quantity: 1,
  };

  req.success_url = success_url;
  req.cancel_url = cancel_url;
  req.client_reference_id = client_reference_id;
  req.line_items = line_items;

  next();
});

// Booking Model
export const createBookingCheckOut = catchAsyncError(async (req, res, next) => {
  const { car, user, price } = req.query;
  if (!car && !user && !price) return next();

  await Booking.create({ bookedProductId: car, userId: user, price });

  res.redirect(req.originalUrl.split("?")[0]);
});
