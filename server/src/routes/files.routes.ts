import { verifyToken } from "../middlewares/auth.middleware";
import { uploadFile, getFileInfo } from "../controllers/files.controller";
import { upload } from "../config/supabase";
import express from "express";

const router = express.Router();

router.post("/upload", verifyToken, upload.single("file"), uploadFile);
router.get("/:fileId", verifyToken, getFileInfo);

export default router;
