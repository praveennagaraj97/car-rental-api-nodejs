import { Router } from "express";

import { startChat } from "./../controller/chatController";

export const chatRouter = Router();

chatRouter.route("/").get(startChat);
