import { io } from "socket.io-client";

const URL = "http://localhost:3000";

const socket = io(URL, {
    auth: {
        token: localStorage.getItem("token")
    }
});

export default socket;
