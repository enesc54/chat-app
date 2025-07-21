import { Socket } from "socket.io";
import { IGetRoomMessagesPayload } from "../../../types/message.types";
import {
    IApiResponse,
    ErrorCodes,
    ErrorMessages,
    IGetRoomMessagesResponse
} from "../../../types/response.types";
import { Message } from "../../../models/message.model";
import { checkUserPermissions } from "../../utils/checkUserPermissions";

export function handleGetRoomMessages(socket: Socket) {
    socket.on(
        "get_room_messages",
        async (data: IGetRoomMessagesPayload, callback) => {
            try {
                const { userId, roomId } = data;

                const permissionsCheckResult = await checkUserPermissions({
                    userId,
                    roomId
                });
                if (!permissionsCheckResult.success) {
                    return callback(permissionsCheckResult);
                }

                const permissions = permissionsCheckResult.data?.permissions;
                if (!permissions?.canAccess) {
                    return callback(<IApiResponse>{
                        success: false,
                        error: {
                            message: ErrorMessages[ErrorCodes.FORBIDDEN],
                            code: ErrorCodes.FORBIDDEN
                        }
                    });
                }

                const messages = await Message.find({ roomId }).sort({
                    createdAt: 1
                });
                const response: IApiResponse<IGetRoomMessagesResponse> = {
                    success: true,
                    data: { roomId, messages }
                };
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
        }
    );
}
