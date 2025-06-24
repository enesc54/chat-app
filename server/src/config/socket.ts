import { Server } from "socket.io";

export const setupSocket = server => {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", socket => {
        console.log("New User Connected: ", socket.id);
        socket.on("disconnected", () => {
            console.log("User disconnected");
        });
    });

    return io;
};
