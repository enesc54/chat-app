import { Server } from "socket.io";
import handleMessageEvents from "../socket/handlers/message.handler";

export const setupSocket = server => {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
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
