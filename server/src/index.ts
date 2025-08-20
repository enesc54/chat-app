import dotenv from "dotenv";
dotenv.config();
import http from "http";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db";
import { setupSocket } from "./config/socket";
import authRouter from "./routes/auth.routes";
import chatsRouter from "./routes/chats.routes";
import filesRouter from "./routes/files.routes";

connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/chats", chatsRouter);
app.use("/api/files", filesRouter);

const server = http.createServer(app);
const io = setupSocket(server);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
