import { config } from "dotenv";
config({ path: "../config.env" });

import { Stripe } from "stripe";

import { catchAsyncError } from "./../utils/catchAsyncError";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const checkoutSession = catchAsyncError(async (req, res, next) => {
  const stripeSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],

    success_url: req.success_url,

    cancel_url: req.cancel_url,

    customer_email: req.loggedUser.email,
    client_reference_id: req.client_reference_id,
    line_items: [req.line_items],
  });

  res.status(200).json({
    stripeSession,
  });
});
