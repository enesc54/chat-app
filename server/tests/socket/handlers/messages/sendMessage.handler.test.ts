import { createServer, Server as HttpServer } from "http";
import { Server as IOServer } from "socket.io";
import { io as Client, Socket as ClientSocket } from "socket.io-client";
import { AddressInfo } from "net";

import { handleSendMessage } from "../../../../src/socket/handlers/messages/sendMessage.handler";
import { handleJoinRoom } from "../../../../src/socket/handlers/messages/joinRoom.handler";
import { checkUserPermissions } from "../../../../src/socket/utils/checkUserPermissions";
import {
    ErrorCodes,
    ErrorMessages
} from "../../../../src/types/response.types";
import { Message } from "../../../../src/models/message.model";

const mockSave = jest.fn().mockResolvedValue({
    _id: "message1",
    senderId: "user1",
    roomId: "room1",
    content: { type: "text", data: "Message Content" },
    createdAt: new Date()
});

const mockMessageInstance = { save: mockSave };

jest.mock("../../../../src/models/message.model", () => ({
    Message: jest.fn(() => mockMessageInstance)
}));
jest.mock("../../../../src/socket/utils/checkUserPermissions");

describe("send_message event", () => {
    let io: IOServer;
    let httpServer: HttpServer;
    let senderClient: ClientSocket;
    let receiverClient: ClientSocket;

    const messageData = {
        senderId: "user1",
        roomId: "room1",
        content: {
            type: "text",
            data: "Message Content"
        }
    };

    const mockedCheckUserPermissions = checkUserPermissions as jest.Mock;

    beforeAll(done => {
        httpServer = createServer();
        io = new IOServer(httpServer);

        io.on("connection", socket => {
            handleJoinRoom(socket);
            handleSendMessage(io, socket);
        });

        httpServer.listen(() => {
            const port = (httpServer.address() as AddressInfo).port;
            senderClient = Client(`http://localhost:${port}`);
            receiverClient = Client(`http://localhost:${port}`);

            let connected = 0;
            const checkDone = () => {
                connected++;
                if (connected === 2) done();
            };

            senderClient.on("connect", checkDone);
            receiverClient.on("connect", checkDone);
        });
    });

    afterAll(async () => {
        await io.close();
        await senderClient.close();
        await receiverClient.close();
        httpServer.close();
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

        senderClient.emit("send_message", messageData, response => {
            expect(response.success).toBe(false);
            expect(response.error?.code).toBe(ErrorCodes.FORBIDDEN);
            expect(response.error?.message).toBe(
                ErrorMessages[ErrorCodes.FORBIDDEN]
            );
            done();
        });
    });

    it("should return error if permissions.canAccess is false", done => {
        mockedCheckUserPermissions.mockResolvedValueOnce({
            success: true,
            data: { permissions: { roleId: "role1", canAccess: false } }
        });

        senderClient.emit("send_message", messageData, response => {
            expect(response.success).toBe(false);
            expect(response.error?.code).toBe(ErrorCodes.FORBIDDEN);
            expect(response.error?.message).toBe(
                ErrorMessages[ErrorCodes.FORBIDDEN]
            );
            done();
        });
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

        senderClient.emit("send_message", messageData, response => {
            expect(response.success).toBe(false);
            expect(response.error?.code).toBe(ErrorCodes.FORBIDDEN);
            expect(response.error?.message).toBe(
                ErrorMessages[ErrorCodes.FORBIDDEN]
            );
            done();
        });
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
            { userId: "user2", roomId: "room1" },
            receiverJoinResponse => {
                expect(receiverJoinResponse.success).toBe(true);
                senderClient.emit(
                    "join_room",
                    { userId: "user1", roomId: "room1" },
                    senderJoinResponse => {
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
                            response => {
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

        senderClient.emit("send_message", messageData, response => {
            expect(response.success).toBe(false);
            expect(response.error?.code).toBe(ErrorCodes.API_ERROR);
            expect(response.error?.message).toBe(
                ErrorMessages[ErrorCodes.API_ERROR]
            );
            done();
        });
    });
});
