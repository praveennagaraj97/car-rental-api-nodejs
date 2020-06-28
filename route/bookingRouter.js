import { Router } from "express";

import {
  // Protect Access
  protectRoute,

  // Booking
  CarBooking,
  hotelBooking,
  partBooking,

  // Stripe Session
  checkoutSession,
} from "./../controller/bookingController";

export const bookingRouter = Router();

bookingRouter
  .route("/checkout-car/:id")
  .get(protectRoute, CarBooking, checkoutSession);

bookingRouter
  .route("/checkout-shop/:id")
  .get(protectRoute, partBooking, checkoutSession);

bookingRouter
  .route("/checkout-hotel/:roomId")
  .get(protectRoute, hotelBooking, checkoutSession);
