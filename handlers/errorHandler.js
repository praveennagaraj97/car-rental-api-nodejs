const unexpectedErrorHandleFunc = (err, req, res, next) => {
  res.status(500).json({
    status: `${err.name}`,
    message: `${err.message}`,
    issue: err,
  });
};

export const errHandler = (err, req, res, next) => {
  if (req.originalUrl.startsWith("/v1/ExploreDreamDiscover")) {
    if (err.message === "You Are Not Logged In Please Log-In") {
      return res.redirect(
        "http://localhost:3000/v1/ExploreDreamDiscover/login"
      );
    }
    return res.render("error/apperror", { message: err.message });
  } else {
    if (err.code === 11000) {
      err.message = `${
        err.keyValue[Object.keys(err.keyValue)]
      } is already Taken😒.`;
      return unexpectedErrorHandleFunc(err, req, res, next);
    }
    if (err.name === "CastError")
      return unexpectedErrorHandleFunc(err, req, res, next);
    if (err.name === "ValidationError")
      return unexpectedErrorHandleFunc(err, req, res, next);

    if (err.name === "TokenExpiredError") {
      res.clearCookie("jwt");
      return unexpectedErrorHandleFunc(err, req, res, next);
    }
  }
  err.message = err.message;
  err.statusCode = err.statusCode || 500;
  err.stack = err.stack;
  err.name = err.name;

  res.status(err.statusCode).json({
    message: err.message,
    name: err.name,
    stack: err.stack,
  });
};

// Unhandled and Uncaught Exceptions
export const serverCloser = (server, mongooseConnection) =>
  server.close(() => {
    mongooseConnection.close();
    console.log("Server Closed");
  });

// Page Not Found

export const pageNotFoundError = (req, res, next) => {
  if (req.originalUrl.startsWith("/api/v1/ExploreDreamDiscover")) {
    return res.status(404).json({
      message: "page Not Found",
    });
  }
  res.render("error/404error");
};
