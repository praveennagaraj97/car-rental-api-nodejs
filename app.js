import { config } from "dotenv";
config({ path: "./config.env" });

import { errHandler, pageNotFoundError } from "./handlers/errorHandler";

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
});

import Express from "express";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import hpp from "hpp";
import cookieParser from "cookie-parser";
import compression from "compression";

import { join } from "path";

import { carRouter } from "./route/carRouter";
import { hotelRouter } from "./route/hotelRouter";
import { shopRouter } from "./route/shopRouter";
import { forumRouter } from "./route/forumRouter";
import { userRouter } from "./route/userRouter";
import { reviewRouter } from "./route/reviewRouter";
import { hotelReviewRouter } from "./route/hotelReviewRouter";
import { viewRouter } from "./route/viewRouter";
import { todoRouter } from "./route/todoRouter";
import { socialMediaRouter } from "./route/socialMediaRouter";
import { bookingRouter } from "./route/bookingRouter";

// Multer SetUp Take FileSize
import { multerSetup } from "./utils/multerSetup";

export const app = Express();

app.use(cookieParser());

// Size can be Passed To Multer
app.use(multerSetup().array("image"));

// Middlewares behind the scene
app.use((req, res, next) => {
  // console.log(req.cookies);
  next();
});

// 30 Requests Per Hour Rate-Limiter
const limiter = rateLimit({
  max: 130,
  windowMs: 60 * 60 * 1000,
  message: "Too Many Request Please Try Again After 1 hr",
});

// Secured Http Headers
app.use(helmet());

// Parameter Pollution (avoiding repeated query)
// WhiteList Can Be Added To Ignore Some query
app.use(
  hpp({
    whitelist: [],
  })
);
app.use(compression());

app.use("/v1", limiter);

app.use(morgan("tiny"));

app.use(Express.json({ limit: "20kb" }));
app.use(Express.urlencoded({ extended: false }));
app.use(Express.static(join(__dirname, "views")));
app.set("view engine", "pug");
app.set("views", join(__dirname, "views"));

// Sanitize Against No-Sql Injection EX :email : { "gt" : '' }
// This will remove $ signs
app.use(mongoSanitize());

// Data Sanitize for html injection
app.use(xss());

app.use(process.env.DEFAULT_URL + "/carRental", carRouter);
app.use(process.env.DEFAULT_URL + "/hotel", hotelRouter);
app.use(process.env.DEFAULT_URL + "/shopcarparts", shopRouter);
app.use(process.env.DEFAULT_URL + "/forum", forumRouter);
app.use(process.env.DEFAULT_URL + "/user", userRouter);
app.use(process.env.DEFAULT_URL + "/blog/reviewOnUs", reviewRouter);
app.use(process.env.DEFAULT_URL + "/hotelReview", hotelReviewRouter);
app.use(process.env.DEFAULT_URL + "/todo", todoRouter);
app.use(process.env.DEFAULT_URL + "/socialmedia", socialMediaRouter);
app.use(process.env.DEFAULT_URL + "/booking", bookingRouter);

app.use("/v1/ExploreDreamDiscover", viewRouter);

app.all("*", pageNotFoundError);

app.use(errHandler);

console.log("Environment : " + process.env.NODE_ENV);
