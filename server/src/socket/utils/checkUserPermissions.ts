import {
    IApiResponse,
    ErrorCodes,
    ErrorMessages
} from "../../types/response.types";
import { IRoomPermissions } from "../../types/room.types";
import { createErrorResponse } from "../../utils/response";
import { Server as ServerModel } from "../../models/server.model";
import { Room } from "../../models/room.model";
import { Types } from "mongoose";

interface ICheckUserPermissionsInput {
    userId: string;
    roomId: string;
}

export async function checkUserPermissions({
    userId,
    roomId
}: ICheckUserPermissionsInput): Promise<
    IApiResponse<{ permissions: IRoomPermissions }>
> {
    if (!userId || !roomId)
        return createErrorResponse(ErrorCodes.INVALID_PAYLOAD);

    const room = await Room.findById(roomId);
    if (!room) return createErrorResponse(ErrorCodes.ROOM_NOT_FOUND);

    const server = await ServerModel.findOne(
        {
            _id: room.serverId,
            "members.userId": userId
        },
        { "members.$": 1 }
    );
    if (!server) return createErrorResponse(ErrorCodes.SERVER_NOT_FOUND);

    const member = server?.members[0];
    const userRole = member?.role;
    if (!userRole) return createErrorResponse(ErrorCodes.ROLE_NOT_FOUND);
    if (!room.permissions || !room.permissions.length)
        return createErrorResponse(ErrorCodes.PERMISSION_NOT_FOUND);

    const permissions = room.permissions.find(p => {
        return p.roleId.equals(userRole as Types.ObjectId);
    });
    if (!permissions)
        return createErrorResponse(ErrorCodes.PERMISSION_NOT_FOUND);

    return {
        success: true,
        data: {
            permissions
        }
    };
}
