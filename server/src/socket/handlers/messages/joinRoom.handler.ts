import { Socket } from "socket.io";
import {
    IApiResponse,
    ErrorCodes,
    ErrorMessages,
    IJoinRoomSuccessResponse
} from "../../../types/response.types";
import { checkUserPermissions } from "../../utils/checkUserPermissions";
import { IJoinRoomPayload } from "../../../types/room.types";

export function handleJoinRoom(socket: Socket) {
    socket.on("join_room", async (data: IJoinRoomPayload, callback) => {
      console.log("aaaaaaaaaaaaaaaa")
        try {
            const userId = socket.data.user.userId;
            const { roomId } = data;

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
            socket.join(roomId);
            const response: IApiResponse<IJoinRoomSuccessResponse> = {
                success: true,
                data: {
                    roomId,
                    permissions
                }
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
    });
}
