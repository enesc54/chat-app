import { checkUserPermissions } from "../../../../src/socket/utils/checkUserPermissions";
import {
    ErrorCodes,
    ErrorMessages
} from "../../../../src/types/response.types";
import * as responseUtils from "../../../../src/utils/response";
import { Room } from "../../../../src/models/room.model";
import { Server } from "../../../../src/models/server.model";
import mongoose from "mongoose";

jest.mock("../../../../src/utils/response", () => ({
    createErrorResponse: jest.fn((code: ErrorCodes) => ({
        success: false,
        error: {
            message: ErrorMessages[code],
            code
        }
    }))
}));

jest.mock("../../../../src/models/room.model", () => ({
    Room: {
        findById: jest.fn()
    }
}));

jest.mock("../../../../src/models/server.model", () => ({
    Server: {
        findOne: jest.fn()
    }
}));

describe("checkUserPermissions", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return error if userId missing", async () => {
        const result = await checkUserPermissions({
            userId: "",
            roomId: "room1"
        });
        expect(result.success).toBe(false);
        expect(result.error?.code).toBe(ErrorCodes.INVALID_PAYLOAD);
        expect(result.error?.message).toBe(
            ErrorMessages[ErrorCodes.INVALID_PAYLOAD]
        );

        expect(responseUtils.createErrorResponse).toHaveBeenCalledWith(
            ErrorCodes.INVALID_PAYLOAD
        );
        expect(Room.findById).not.toHaveBeenCalled();
        expect(Server.findOne).not.toHaveBeenCalled();
    });

    it("should return error if roomId missing", async () => {
        const result = await checkUserPermissions({
            userId: "user1",
            roomId: ""
        });
        expect(result.success).toBe(false);
        expect(result.error?.code).toBe(ErrorCodes.INVALID_PAYLOAD);
        expect(result.error?.message).toBe(
            ErrorMessages[ErrorCodes.INVALID_PAYLOAD]
        );

        expect(responseUtils.createErrorResponse).toHaveBeenCalledWith(
            ErrorCodes.INVALID_PAYLOAD
        );
        expect(Room.findById).not.toHaveBeenCalled();
        expect(Server.findOne).not.toHaveBeenCalled();
    });

    it("should return error if room not found", async () => {
        (Room.findById as jest.Mock).mockResolvedValue(null);

        const result = await checkUserPermissions({
            userId: "user1",
            roomId: "room1"
        });

        expect(result.success).toBe(false);
        expect(result.error?.code).toBe(ErrorCodes.ROOM_NOT_FOUND);
        expect(result.error?.message).toBe(
            ErrorMessages[ErrorCodes.ROOM_NOT_FOUND]
        );

        expect(responseUtils.createErrorResponse).toHaveBeenCalledWith(
            ErrorCodes.ROOM_NOT_FOUND
        );
        expect(Room.findById).toHaveBeenCalledWith("room1");
        expect(Server.findOne).not.toHaveBeenCalled();
    });

    it("should return error if server not found or the user is not a member of the server", async () => {
        (Room.findById as jest.Mock).mockResolvedValue({
            _id: "room1",
            serverId: "server1"
        });
        (Server.findOne as jest.Mock).mockResolvedValue(null);

        const result = await checkUserPermissions({
            userId: "user1",
            roomId: "room1"
        });

        expect(result.success).toBe(false);
        expect(result.error?.code).toBe(ErrorCodes.SERVER_NOT_FOUND);
        expect(result.error?.message).toBe(
            ErrorMessages[ErrorCodes.SERVER_NOT_FOUND]
        );

        expect(responseUtils.createErrorResponse).toHaveBeenCalledWith(
            ErrorCodes.SERVER_NOT_FOUND
        );
        expect(Room.findById).toHaveBeenCalledWith("room1");
        expect(Server.findOne).toHaveBeenCalledWith(
            {
                _id: "server1",
                "members.userId": "user1"
            },
            { "members.$": 1 }
        );
    });

    it("should return error if role not found", async () => {
        (Room.findById as jest.Mock).mockResolvedValue({
            _id: "room1",
            serverId: "server1"
        });
        (Server.findOne as jest.Mock).mockResolvedValue({
            members: [{ userId: "user1" }]
        });

        const result = await checkUserPermissions({
            userId: "user1",
            roomId: "room1"
        });

        expect(result.success).toBe(false);
        expect(result.error?.code).toBe(ErrorCodes.ROLE_NOT_FOUND);
        expect(result.error?.message).toBe(
            ErrorMessages[ErrorCodes.ROLE_NOT_FOUND]
        );

        expect(responseUtils.createErrorResponse).toHaveBeenCalledWith(
            ErrorCodes.ROLE_NOT_FOUND
        );
        expect(Room.findById).toHaveBeenCalledWith("room1");
        expect(Server.findOne).toHaveBeenCalledWith(
            {
                _id: "server1",
                "members.userId": "user1"
            },
            { "members.$": 1 }
        );
    });

    it("should return error if permissions not found in room", async () => {
        (Room.findById as jest.Mock).mockResolvedValue({
            _id: "room1",
            serverId: "server1"
        });
        (Server.findOne as jest.Mock).mockResolvedValue({
            members: [{ userId: "user1", role: "role1" }]
        });

        const result = await checkUserPermissions({
            userId: "user1",
            roomId: "room1"
        });

        expect(result.success).toBe(false);
        expect(result.error?.code).toBe(ErrorCodes.PERMISSION_NOT_FOUND);
        expect(result.error?.message).toBe(
            ErrorMessages[ErrorCodes.PERMISSION_NOT_FOUND]
        );

        expect(responseUtils.createErrorResponse).toHaveBeenCalledWith(
            ErrorCodes.PERMISSION_NOT_FOUND
        );
        expect(Room.findById).toHaveBeenCalledWith("room1");
        expect(Server.findOne).toHaveBeenCalledWith(
            {
                _id: "server1",
                "members.userId": "user1"
            },
            { "members.$": 1 }
        );
    });

    it("should return error if there is no permission matching the roleId", async () => {
        const mockRoleId1 = new mongoose.Types.ObjectId();
        const mockRoleId2 = new mongoose.Types.ObjectId();

        (Room.findById as jest.Mock).mockResolvedValue({
            _id: "room1",
            serverId: "server1",
            permissions: [{ roleId: mockRoleId1 }]
        });

        (Server.findOne as jest.Mock).mockResolvedValue({
            members: [{ userId: "user1", role: mockRoleId2 }]
        });

        const result = await checkUserPermissions({
            userId: "user1",
            roomId: "room1"
        });

        expect(result.success).toBe(false);
        expect(result.error?.code).toBe(ErrorCodes.PERMISSION_NOT_FOUND);
        expect(result.error?.message).toBe(
            ErrorMessages[ErrorCodes.PERMISSION_NOT_FOUND]
        );

        expect(responseUtils.createErrorResponse).toHaveBeenCalledWith(
            ErrorCodes.PERMISSION_NOT_FOUND
        );
        expect(Room.findById).toHaveBeenCalledWith("room1");
        expect(Server.findOne).toHaveBeenCalledWith(
            {
                _id: "server1",
                "members.userId": "user1"
            },
            { "members.$": 1 }
        );
    });

    it("should return success", async () => {
        const mockRoleId = new mongoose.Types.ObjectId();

        (Room.findById as jest.Mock).mockResolvedValue({
            _id: "room1",
            serverId: "server1",
            permissions: [{ roleId: mockRoleId }]
        });

        (Server.findOne as jest.Mock).mockResolvedValue({
            members: [{ userId: "user1", role: mockRoleId }]
        });

        const result = await checkUserPermissions({
            userId: "user1",
            roomId: "room1"
        });

        expect(result.success).toBe(true);
        expect(result.data?.permissions).toEqual({ roleId: mockRoleId });

        expect(Room.findById).toHaveBeenCalledWith("room1");
        expect(Server.findOne).toHaveBeenCalledWith(
            {
                _id: "server1",
                "members.userId": "user1"
            },
            { "members.$": 1 }
        );
    });
});
