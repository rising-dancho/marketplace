import { Router } from "express";
import requireAuth from "../middleware/requireAuth.js";
import {getAllChatHistoryWithUser, getAllSelectedUserChatHistory} from "../controllers/chat.controller.js";

const chatRouter = Router();
chatRouter.post("/getHistory", requireAuth, getAllChatHistoryWithUser);
chatRouter.post("/getUserChatHistory", requireAuth, getAllSelectedUserChatHistory);

export default chatRouter;