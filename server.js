import socket from "socket.io";

import { connect, connection } from "mongoose";

import { serverCloser } from "./handlers/errorHandler";

import { app } from "./app";

// Mongoose Connection
const DB = process.env.MONGODB_CONNECTION.replace(
  "<password>",
  process.env.MONGODB_PASSWORD
);

connect(DB, {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("MongoDB DataBase Connected");
});

const server = app.listen(process.env.PORT, () => {
  console.log(`Listening On PORT : localhost:${process.env.PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  serverCloser(server, connection);
});

// Once Server Starts Chat Has To Be Connected So We Keep This After Server Established
import { socketSetup } from "./controller/chatController";

const io = socket(server);

socketSetup(io, socket);
