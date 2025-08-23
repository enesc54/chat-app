import { verifyToken } from "../middlewares/auth.middleware";
import {
    getServers,
    getRooms,
    getCategories,
    createServer,
    joinServer
} from "../controllers/chats.controller";
import express from "express";

const router = express.Router();

router.get("/getServers", verifyToken, getServers);
router.get("/getRooms/:serverId", verifyToken, getRooms);
router.get("/getCategories/:serverId", verifyToken, getCategories);
router.post("/createServer", verifyToken, createServer);
router.get("/joinServer/:serverId", verifyToken, joinServer);

export default router;
