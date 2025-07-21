import { Server as HttpServer } from "http";
import { Server as IOServer } from "socket.io";
import handleMessageEvents from "../socket/handlers/message.handler";
import { createErrorResponse } from "../utils/response";
import { ErrorCodes } from "../types/response.types";
import jwt from "jsonwebtoken";

export const setupSocket = (server: HttpServer) => {
    const io = new IOServer(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.use((socket, next) => {
        const tokenWithBearer = socket.handshake.auth?.token;
        if (!tokenWithBearer) {
            return next(new Error("AUTH_TOKEN_MISSING"));
        }

        const token = tokenWithBearer.replace("Bearer ", "");

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!);
            socket.data.user = decoded;
            next();
        } catch (err) {
            return next(new Error("AUTH_TOKEN_INVALID"));
        }
    });

    io.on("connection", socket => {
        console.log("New User Connected: ", socket.id);
        handleMessageEvents(io, socket);
        socket.on("disconnected", () => {
            console.log("User disconnected");
        });
    });

    return io;
};
