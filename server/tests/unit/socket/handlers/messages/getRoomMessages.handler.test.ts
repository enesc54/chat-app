import { Server as HttpServer } from "http";
import { Server as IOServer } from "socket.io";
import { Socket as ClientSocket } from "socket.io-client";
import { handleGetRoomMessages } from "../../../../../src/socket/handlers/messages/getRoomMessages.handler";
import { checkUserPermissions } from "../../../../../src/socket/utils/checkUserPermissions";
import {
    ErrorCodes,
    ErrorMessages
} from "../../../../../src/types/response.types";
import {
    setupTestServer,
    teardownTestServer
} from "../../../../utils/socketTestUtils";
import { Message } from "../../../../../src/models/message.model";
import { IApiResponse } from "../../../../../src/types/response.types";
import { IMessage } from "../../../../../src/models/message.model";

jest.mock("../../../../../src/models/message.model", () => {
    const mockSort = jest.fn().mockResolvedValue([
        {
            senderId: "user1",
            roomId: "room1",
            content: { type: "text", data: "Message 1" },
            createdAt: new Date("October 13, 2025 11:13:00")
        },
        {
            senderId: "user2",
            roomId: "room1",
            content: { type: "text", data: "Message 2" },
            createdAt: new Date("October 13, 2025 11:14:00")
        }
    ]);

    const mockFind = jest.fn().mockReturnValue({ sort: mockSort });

    return {
        __esModule: true,
        Message: {
            find: mockFind
        }
    };
});
jest.mock("../../../../../src/socket/utils/checkUserPermissions");

describe("get_room_messages event", () => {
    let io: IOServer;
    let httpServer: HttpServer;
    let clients: ClientSocket[];
    let clientSocket: ClientSocket;

    const payloadData = {
        roomId: "room1"
    };

    const mockedCheckUserPermissions = checkUserPermissions as jest.Mock;

    beforeAll(async () => {
        const setupServer = await setupTestServer((io, socket) => {
            handleGetRoomMessages(socket);
        }, 1);

        io = setupServer.io;
        httpServer = setupServer.httpServer;
        clients = setupServer.clients;

        clientSocket = clients[0];
    });

    afterAll(async () => {
        await teardownTestServer(io, httpServer, clients);
    });

    it("should return error if checkUserPermissions fails", done => {
        mockedCheckUserPermissions.mockResolvedValueOnce({
            success: false,
            error: {
                code: ErrorCodes.FORBIDDEN,
                message: ErrorMessages[ErrorCodes.FORBIDDEN]
            }
        });

        clientSocket.emit(
            "get_room_messages",
            payloadData,
            (response: IApiResponse) => {
                expect(response.success).toBe(false);
                expect(response.error?.code).toBe(ErrorCodes.FORBIDDEN);
                expect(response.error?.message).toBe(
                    ErrorMessages[ErrorCodes.FORBIDDEN]
                );
                done();
            }
        );
    });

    it("should return error if permissions.canAccess is false", done => {
        mockedCheckUserPermissions.mockResolvedValueOnce({
            success: true,
            data: { permissions: { canAccess: false } }
        });
        clientSocket.emit(
            "get_room_messages",
            payloadData,
            (response: IApiResponse) => {
                expect(response.success).toBe(false);
                expect(response.error?.code).toBe(ErrorCodes.FORBIDDEN);
                expect(response.error?.message).toBe(
                    ErrorMessages[ErrorCodes.FORBIDDEN]
                );

                done();
            }
        );
    });

    it("should return success and room messages", done => {
        mockedCheckUserPermissions.mockResolvedValueOnce({
            success: true,
            data: { permissions: { canAccess: true } }
        });

        clientSocket.emit(
            "get_room_messages",
            payloadData,
            (response: IApiResponse<{ messages: IMessage[] }>) => {
                const timestamps =
                    response.data?.messages.map(m =>
                        new Date(m.createdAt).getTime()
                    ) ?? [];
                expect(timestamps.length).toBeGreaterThan(0);

                const isSortedAsc = timestamps.every(
                    (t, i, arr) => i === 0 || arr[i - 1] <= t
                );
                expect(isSortedAsc).toBe(true);

                expect(response.success).toBe(true);
                expect(response.data?.messages).toHaveLength(2);
                expect(response.data?.messages[0].content.data).toBe(
                    "Message 1"
                );
                expect(response.data?.messages[1].content.data).toBe(
                    "Message 2"
                );
                expect(Message.find).toHaveBeenCalledWith({
                    roomId: "room1"
                });

                done();
            }
        );
    });

    it("should return API_ERROR if exception thrown", done => {
        mockedCheckUserPermissions.mockImplementationOnce(() => {
            throw new Error("Unexpected Error");
        });

        clientSocket.emit(
            "get_room_messages",
            payloadData,
            (response: IApiResponse) => {
                expect(response.success).toBe(false);
                expect(response.error?.code).toBe(ErrorCodes.API_ERROR);
                expect(response.error?.message).toBe(
                    ErrorMessages[ErrorCodes.API_ERROR]
                );
                done();
            }
        );
    });
});
