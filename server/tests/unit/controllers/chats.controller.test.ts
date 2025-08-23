import request from "supertest";
import express, { Express } from "express";
import chatsRouter from "../../../src/routes/chats.routes";
import { Server as ServerModel } from "../../../src/models/server.model";
import { Room } from "../../../src/models/room.model";
import { ErrorCodes, ErrorMessages } from "../../../src/types/response.types";
import jwt, { JwtPayload } from "jsonwebtoken";
import { verifyToken } from "../../../src/middlewares/auth.middleware";
import mongoose from "mongoose";

const saveMock = jest.fn().mockResolvedValue({
    _id: "507f1f77bcf86cd799439011",
    name: "Test Server",
    logo: "test-logo-url",
    banner: "test-banner-url",
    members: [{ userId: "507f1f77bcf86cd799439011" }],
    toObject: () => ({
        _id: "507f1f77bcf86cd799439011",
        name: "Test Server",
        logo: "test-logo-url",
        banner: "test-banner-url",
        members: [{ userId: "507f1f77bcf86cd799439011" }]
    })
});

const mockServerInstance = {
    save: saveMock
};

jest.mock("../../../src/models/server.model", () => ({
    Server: Object.assign(
        jest.fn(() => mockServerInstance),
        {
            find: jest.fn(),
            findOne: jest.fn(),
            findById: jest.fn()
        }
    )
}));
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

describe("get categories event", () => {
    it("should return 400 if serverId is invalid or categories data is not in the server", async () => {
        mockedVerifyToken.mockImplementation((req, _res, next) => {
            req.user = { userId: "507f1f77bcf86cd799439011" };
            next();
        });

        const res = await request(app).get("/api/chats/getRooms/invalid_id");

        expect(res.status).toBe(400);
        expect(res.body.error.code).toBe(ErrorCodes.SERVER_NOT_FOUND);
    });

    it("should return categories if serverId is not invalid", async () => {
        (ServerModel.findOne as jest.Mock).mockResolvedValue({
            _id: "507f1f77bcf86cd799439011",
            categories: [
                {
                    _id: "test_category_1",
                    name: "Test Category 1",
                    position: 1
                },
                {
                    _id: "test_category_2",
                    name: "Test Category 2",
                    position: 2
                }
            ]
        });

        mockedVerifyToken.mockImplementation((req, _res, next) => {
            req.user = { userId: "507f1f77bcf86cd799439011" };
            next();
        });

        const res = await request(app).get(
            "/api/chats/getCategories/507f1f77bcf86cd799439011"
        );

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    });
});

describe("create server event", () => {
    beforeAll(() => {
        mockedVerifyToken.mockImplementation((req, _res, next) => {
            req.user = { userId: "507f1f77bcf86cd799439011" };
            next();
        });
    });

    it("should return 400 if template is invalid", async () => {
        const res = await request(app).post("/api/chats/createServer").send({
            template: "invalid_template"
        });

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.error.code).toBe(ErrorCodes.INVALID_PAYLOAD);
    });
    it("should return 400 if rooms are not saved", async () => {
        (Room.insertMany as jest.Mock).mockRejectedValue(
            new Error("Room are not saved")
        );
        const res = await request(app).post("/api/chats/createServer").send({
            template: "NOT_USING",
            serverName: "Test Server",
            serverDescription: "Test Server Description",
            logoUrl: "test-logo-url",
            bannerUrl: "test-banner-url"
        });

        expect(res.status).toBe(500);
        expect(res.body.success).toBe(false);
        expect(res.body.error.code).toBe(ErrorCodes.API_ERROR);
    });
    it("should return server and rooms if server creation is success", async () => {
        (Room.insertMany as jest.Mock).mockResolvedValue([
            {
                _id: "test-room-1",
                type: "text",
                name: "general chat",
                serverId: "test_server_id",
                categoryId: "test-text-category",
                permission: []
            }
        ]);
        const res = await request(app).post("/api/chats/createServer").send({
            template: "NOT_USING",
            serverName: "Test Server",
            serverDescription: "Test Server Description",
            logoUrl: "test-logo-url",
            bannerUrl: "test-banner-url"
        });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    });
});

describe("join server event", () => {
    beforeAll(() => {
        mockedVerifyToken.mockImplementation((req, _res, next) => {
            req.user = { userId: "507f1f77bcf86cd799439011" };
            next();
        });
    });

    it("should return 404 if server id is invalid", async () => {
        (ServerModel.findById as jest.Mock).mockResolvedValue(null);

        const res = await request(app).get(
            "/api/chats/joinServer/invalid-server-id"
        );

        expect(res.status).toBe(404);
        expect(res.body.error.code).toBe(ErrorCodes.SERVER_NOT_FOUND);
    });
    it("should return 404 if everyone role is not found", async () => {
        (ServerModel.findById as jest.Mock).mockResolvedValue({ roles: [] });

        const res = await request(app).get(
            "/api/chats/joinServer/507f1f77bcf86cd799439011"
        );

        expect(res.status).toBe(404);
        expect(res.body.error.code).toBe(ErrorCodes.ROLE_NOT_FOUND);
    });
    it("should return 400 if user already member of server", async () => {
        (ServerModel.findById as jest.Mock).mockResolvedValue({
            roles: [{ _id: "507f1f77bcf86cd799439011", name: "everyone" }],
            members: [{ userId: "507f1f77bcf86cd799439011" }]
        });

        const res = await request(app).get(
            "/api/chats/joinServer/507f1f77bcf86cd799439011"
        );

        expect(res.status).toBe(400);
        expect(res.body.error.code).toBe(ErrorCodes.ALREADY_MEMBER);
    });
    it("should return updated server if join is successfull", async () => {
        (ServerModel.findById as jest.Mock).mockResolvedValue({
            roles: [{ _id: "507f1f77bcf86cd799439011", name: "everyone" }],
            members: [],
            save: jest.fn().mockResolvedValue({
                roles: [
                    { _id: new mongoose.Types.ObjectId(), name: "everyone" }
                ],
                members: [{ userId: "507f1f77bcf86cd799439011" }]
            })
        });

        const res = await request(app).get(
            "/api/chats/joinServer/507f1f77bcf86cd799439011"
        );

        expect(res.status).toBe(200);
        expect(res.body.data.members[0].userId).toBe(
            "507f1f77bcf86cd799439011"
        );
    });
});
