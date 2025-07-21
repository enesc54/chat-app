import { Server, Socket } from "socket.io";
import { Message } from "../../../models/message.model";
import { ISendMessagePayload } from "../../../types/message.types";
import {
    IApiResponse,
    ErrorCodes,
    ErrorMessages
} from "../../../types/response.types";
import { checkUserPermissions } from "../../utils/checkUserPermissions";

export function handleSendMessage(io: Server, socket: Socket) {
    socket.on("send_message", async (data: ISendMessagePayload, callback) => {
        try {
            const senderId = socket.data.user.userId;
            const { roomId, content } = data;

            const permissionsCheckResult = await checkUserPermissions({
                userId: senderId,
                roomId
            });
            if (!permissionsCheckResult.success) {
                return callback(permissionsCheckResult);
            }

            const permissions = permissionsCheckResult.data?.permissions;
            if (
                permissions?.canAccess !== true ||
                permissions?.canSendMessage !== true
            ) {
                return callback(<IApiResponse>{
                    success: false,
                    error: {
                        message: ErrorMessages[ErrorCodes.FORBIDDEN],
                        code: ErrorCodes.FORBIDDEN
                    }
                });
            }

            const message = new Message({ roomId, senderId, content });
            const savedMessage = await message.save();

            io.to(roomId).emit("receive_message", savedMessage);

            const response: IApiResponse = { success: true };
            callback(response);
        } catch (error) {
            callback(<IApiResponse>{
                success: false,
                error: {
                    message: ErrorMessages[ErrorCodes.API_ERROR],
                    code: ErrorCodes.API_ERROR
                }
            });
        }
    });
}
