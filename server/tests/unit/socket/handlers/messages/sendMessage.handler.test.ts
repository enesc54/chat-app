import { Server as HttpServer } from "http";
import { Server as IOServer } from "socket.io";
import { Socket as ClientSocket } from "socket.io-client";
import { handleSendMessage } from "../../../../../src/socket/handlers/messages/sendMessage.handler";
import { handleJoinRoom } from "../../../../../src/socket/handlers/messages/joinRoom.handler";
import { checkUserPermissions } from "../../../../../src/socket/utils/checkUserPermissions";
import {
    ErrorCodes,
    ErrorMessages
} from "../../../../../src/types/response.types";
import { Message } from "../../../../../src/models/message.model";
import {
    setupTestServer,
    teardownTestServer
} from "../../../../utils/socketTestUtils";
import { IApiResponse } from "../../../../../src/types/response.types";

const mockSave = jest.fn().mockResolvedValue({
    _id: "message1",
    roomId: "room1",
    senderId: "user1",
    content: { type: "text", data: "Message Content" },
    createdAt: new Date()
});

const mockMessageInstance = { save: mockSave };

jest.mock("../../../../../src/models/message.model", () => ({
    Message: jest.fn(() => mockMessageInstance)
}));
jest.mock("../../../../../src/socket/utils/checkUserPermissions");

describe("send_message event", () => {
    let io: IOServer;
    let httpServer: HttpServer;
    let clients: ClientSocket[];
    let senderClient: ClientSocket;
    let receiverClient: ClientSocket;

    const messageData = {
        roomId: "room1",
        content: {
            type: "text",
            data: "Message Content"
        }
    };

    const mockedCheckUserPermissions = checkUserPermissions as jest.Mock;

    beforeAll(async () => {
        const setupServer = await setupTestServer((io, socket) => {
            handleJoinRoom(socket);
            handleSendMessage(io, socket);
        }, 2);

        io = setupServer.io;
        httpServer = setupServer.httpServer;
        clients = setupServer.clients;

        senderClient = clients[0];
        receiverClient = clients[1];
    });

    afterAll(async () => {
        await teardownTestServer(io, httpServer, clients);
    });

    beforeEach(() => {
        mockSave.mockClear();
        mockedCheckUserPermissions.mockClear();
    });

    it("should return error if checkUserPermissions fails", done => {
        mockedCheckUserPermissions.mockResolvedValueOnce({
            success: false,
            error: {
                code: ErrorCodes.FORBIDDEN,
                message: ErrorMessages[ErrorCodes.FORBIDDEN]
            }
        });

        senderClient.emit(
            "send_message",
            messageData,
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
            data: { permissions: { roleId: "role1", canAccess: false } }
        });

        senderClient.emit(
            "send_message",
            messageData,
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

    it("should return error if permissions.canSendMessage is false", done => {
        mockedCheckUserPermissions.mockResolvedValueOnce({
            success: true,
            data: {
                permissions: {
                    roleId: "role1",
                    canAccess: true,
                    canSendMessage: false
                }
            }
        });

        senderClient.emit(
            "send_message",
            messageData,
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

    it("should emit message and return success", done => {
        mockedCheckUserPermissions.mockResolvedValue({
            success: true,
            data: {
                permissions: {
                    roleId: "role1",
                    canAccess: true,
                    canSendMessage: true
                }
            }
        });

        receiverClient.emit(
            "join_room",
            { roomId: "room1" },
            (receiverJoinResponse: IApiResponse) => {
                expect(receiverJoinResponse.success).toBe(true);
                senderClient.emit(
                    "join_room",
                    { roomId: "room1" },
                    (senderJoinResponse: IApiResponse) => {
                        expect(senderJoinResponse.success).toBe(true);
                        receiverClient.on("receive_message", message => {
                            expect(message.senderId).toBe("user1");
                            expect(message.content?.type).toBe("text");
                            expect(message.content?.data).toBe(
                                "Message Content"
                            );

                            expect(mockSave).toHaveBeenCalled();
                            done();
                        });

                        senderClient.emit(
                            "send_message",
                            messageData,
                            (response: IApiResponse) => {
                                expect(response.success).toBe(true);
                            }
                        );
                    }
                );
            }
        );
    });

    it("should return API_ERROR if exception thrown", done => {
        mockedCheckUserPermissions.mockImplementationOnce(() => {
            throw new Error("Unexpected Error");
        });

        senderClient.emit(
            "send_message",
            messageData,
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
