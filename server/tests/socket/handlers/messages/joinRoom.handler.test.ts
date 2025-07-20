import { createServer, Server as HttpServer } from "http";
import { Server as IOServer } from "socket.io";
import { io as Client, Socket as ClientSocket } from "socket.io-client";
import { AddressInfo } from "net";
import { handleJoinRoom } from "../../../../src/socket/handlers/messages/joinRoom.handler";
import { checkUserPermissions } from "../../../../src/socket/utils/checkUserPermissions";
import {
    ErrorCodes,
    ErrorMessages
} from "../../../../src/types/response.types";

jest.mock("../../../../src/socket/utils/checkUserPermissions");

describe("join_room event", () => {
    let io: IOServer;
    let httpServer: HttpServer;
    let clientSocket: ClientSocket;

    const mockedCheckUserPermissions = checkUserPermissions as jest.Mock;

    beforeAll(done => {
        httpServer = createServer();
        io = new IOServer(httpServer);

        io.on("connection", socket => {
            handleJoinRoom(socket);
        });

        httpServer.listen(() => {
            const port = (httpServer.address() as AddressInfo).port;
            clientSocket = Client(`http://localhost:${port}`);
            clientSocket.on("connect", done);
        });
    });

    afterAll(async () => {
        await io.close();
        await clientSocket.close();
        httpServer.close();
    });

    beforeEach(() => {
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

        clientSocket.emit(
            "join_room",
            { userId: "user1", roomId: "room1" },
            response => {
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

        clientSocket.emit(
            "join_room",
            { userId: "user1", roomId: "room1" },
            response => {
                expect(response.success).toBe(false);
                expect(response.error?.code).toBe(ErrorCodes.FORBIDDEN);
                expect(response.error?.message).toBe(
                    ErrorMessages[ErrorCodes.FORBIDDEN]
                );
                done();
            }
        );
    });

    it("should join room and return success when permissions allow", done => {
        mockedCheckUserPermissions.mockResolvedValueOnce({
            success: true,
            data: { permissions: { roleId: "role1", canAccess: true } }
        });

        clientSocket.emit(
            "join_room",
            { userId: "user1", roomId: "room1" },
            response => {
                expect(response.success).toBe(true);
                expect(response.data?.roomId).toBe("room1");
                expect(response.data?.permissions).toEqual({
                    roleId: "role1",
                    canAccess: true
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
            "join_room",
            { userId: "user1", roomId: "room1" },
            response => {
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
