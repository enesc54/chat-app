import dotenv from "dotenv";
dotenv.config({ path: ".env" });

import request from "supertest";
import express, { Express } from "express";
import chatsRouter from "../../../src/routes/chats.routes";
import { Server as ServerModel } from "../../../src/models/server.model";
import { Room } from "../../../src/models/room.model";
import { ErrorCodes, ErrorMessages } from "../../../src/types/response.types";
import jwt, { JwtPayload } from "jsonwebtoken";
import { verifyToken } from "../../../src/middlewares/auth.middleware";

jest.mock("../../../src/models/server.model");
jest.mock("../../../src/models/room.model");
jest.mock("../../../src/middlewares/auth.middleware");

let app: Express;
const mockedVerifyToken = verifyToken as jest.Mock;

beforeAll(() => {
    app = express();
    app.use(express.json());

    app.use("/api/chats", chatsRouter);
});

beforeEach(() => {
    jest.clearAllMocks();
});

describe("get servers event", () => {
    it("should return 400 if there is no userId in the authToken", async () => {
        mockedVerifyToken.mockImplementation((req, _res, next) => {
            req.user = { userName: "username" };
            next();
        });
        const res = await request(app).get("/api/chats/getServers");

        expect(res.status).toBe(400);
        expect(res.body.error.code).toBe(ErrorCodes.UNAUTHORIZED);
    });

    it("should return 400 if userId is invalid", async () => {
        mockedVerifyToken.mockImplementation((req, _res, next) => {
            req.user = { userId: "invalid_token" };
            next();
        });

        const res = await request(app).get("/api/chats/getServers");

        expect(res.status).toBe(400);
        expect(res.body.error.code).toBe(ErrorCodes.USER_NOT_FOUND);
    });

    it("should return server list if userId is not invalid", async () => {
        (ServerModel.find as jest.Mock).mockResolvedValue([
            {
                _id: "test_server_id",
                name: "Test Server",
                logo: "logo.png",
                banner: "banner.png"
            }
        ]);

        mockedVerifyToken.mockImplementation((req, _res, next) => {
            req.user = { userId: "507f1f77bcf86cd799439011" };
            next();
        });

        const res = await request(app).get("/api/chats/getServers");

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    });
});

describe("get rooms event", () => {
    it("should return 400 if serverId is invalid", async () => {
        mockedVerifyToken.mockImplementation((req, _res, next) => {
            req.user = { userId: "507f1f77bcf86cd799439011" };
            next();
        });

        const res = await request(app).get("/api/chats/getRooms/invalid_id");

        expect(res.status).toBe(400);
        expect(res.body.error.code).toBe(ErrorCodes.SERVER_NOT_FOUND);
    });
    it("should return room list if serverId is not invalid", async () => {
        (Room.find as jest.Mock).mockResolvedValue([
            {
                _id: "test_room_id",
                name: "Test Room",
                type: "text",
                categoryId: "test_category_id"
            }
        ]);

        mockedVerifyToken.mockImplementation((req, _res, next) => {
            req.user = { userId: "507f1f77bcf86cd799439011" };
            next();
        });

        const res = await request(app).get(
            "/api/chats/getRooms/507f1f77bcf86cd799439011"
        );

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    });
});
