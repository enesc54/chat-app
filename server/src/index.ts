import dotenv from "dotenv";
dotenv.config();
import http from "http";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db";
import { setupSocket } from "./config/socket";
import authRouter from "./routes/auth.routes";

connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRouter);

const server = http.createServer(app);
const io = setupSocket(server);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
