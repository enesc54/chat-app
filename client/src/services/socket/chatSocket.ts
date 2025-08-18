import socket from "./socketClient";

export const joinRoom = (roomId, callback) => {
    socket.emit("join_room", { roomId }, callback);
};

export const getRoomMessages = (roomId, callback) => {
    socket.emit("get_room_messages", { roomId }, callback);
};

export const sendMessage = (roomId, content, callback) => {
    socket.emit("send_message", { roomId, content }, callback);
};

export const receiveMessage = onMessage => {
    socket.on("receive_message", msg => {
        onMessage(msg);
    });
};
