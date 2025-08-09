import { verifyToken } from "../middlewares/auth.middleware";
import { getServers, getRooms } from "../controllers/chats.controller";
import express from "express";

const router = express.Router();

router.get("/getServers", verifyToken, getServers);
router.get("/getRooms/:serverId", verifyToken, getRooms);

export default router;
