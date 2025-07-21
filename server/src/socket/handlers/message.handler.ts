import { Server, Socket } from "socket.io";
import { Message } from "../../models/message.model";
import { ISendMessagePayload } from "../../types/message.types";
import {
    IApiResponse,
    ErrorCodes,
    ErrorMessages,
    IJoinRoomSuccessResponse
} from "../../types/response.types";
import { checkUserPermissions } from "../utils/checkUserPermissions";

import { handleJoinRoom } from "./messages/joinRoom.handler";
import { handleSendMessage } from "./messages/sendMessage.handler";
import { handleGetRoomMessages } from "./messages/getRoomMessages.handler";

function handleMessageEvents(io: Server, socket: Socket) {
    handleJoinRoom(socket);
    handleSendMessage(io, socket);
    handleGetRoomMessages(socket)
}

export default handleMessageEvents;
