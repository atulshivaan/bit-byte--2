import express from "express";
import { protectRoute } from "../middleswares/auth.middleware.js";
import {
  getMessages,
  getUsersForSidebar,
  sendMessage,
} from "../controllers/message.controller.js";

const messageRouter = express.Router();

messageRouter.get("/users", protectRoute, getUsersForSidebar);
messageRouter.get("/:id", getMessages);
messageRouter.post("/send/:id", protectRoute, sendMessage);

export default messageRouter;
