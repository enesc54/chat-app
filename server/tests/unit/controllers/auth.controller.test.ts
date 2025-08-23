import dotenv from "dotenv";
dotenv.config();

import request from "supertest";
import express, { Express } from "express";
import authRoutes from "../../../src/routes/auth.routes";
import { User } from "../../../src/models/user.model";
import { ErrorCodes, ErrorMessages } from "../../../src/types/response.types";
import bcrypt from "bcryptjs";
import { sendMail } from "../../../src/config/mail";
import jwt from "jsonwebtoken";

const saveMock = jest.fn().mockResolvedValue({
    _id: "507f1f77bcf86cd799439011",
    username: "test-username",
    email: "test-email"
});

const mockUserInstance = {
    save: saveMock
};

jest.mock("bcryptjs");
jest.mock("../../../src/config/mail", () => ({
    sendMail: jest.fn()
}));
jest.mock("jsonwebtoken");
jest.mock("../../../src/models/user.model", () => ({
    User: Object.assign(
        jest.fn(() => mockUserInstance),
        {
            findOne: jest.fn(),
            findById: jest.fn()
        }
    )
}));

let app: Express;

beforeAll(() => {
    app = express();
    app.use(express.json());

    app.use("/api/auth", authRoutes);
});

beforeEach(() => {
    jest.clearAllMocks();
});

describe("register event", () => {
    it("should return 400 if email in use", async () => {
        (User.findOne as jest.Mock).mockResolvedValue({
            _id: "507f1f77bcf86cd799439011"
        });

        const res = await request(app).post("/api/auth/register").send({
            username: "test-username",
            email: "test-email",
            password: "test-password",
            fullname: "test-fullname"
        });

        expect(res.status).toBe(400);
        expect(res.body.error.code).toBe(ErrorCodes.EMAIL_IN_USE);
    });
    it("should return 201 if register is success", async () => {
        (User.findOne as jest.Mock).mockResolvedValue(null);
        (jwt.sign as jest.Mock).mockResolvedValue("test-jwt-token");

        const res = await request(app).post("/api/auth/register").send({
            username: "test-username",
            email: "test-email",
            password: "test-password",
            fullname: "test-fullname"
        });

        expect(res.status).toBe(201);
        expect(res.body.data.token).toBeDefined();
    });
});

describe("login event", () => {
    it("should return 401 if invalid credentials", async () => {
        (User.findOne as jest.Mock).mockResolvedValue(null);

        const res = await request(app).post("/api/auth/login").send({
            email: "test-email",
            password: "test-password"
        });

        expect(res.status).toBe(401);
        expect(res.body.error.code).toBe(ErrorCodes.INVALID_CREDENTIALS);
    });
    it("should return 201 if login is success", async () => {
        (User.findOne as jest.Mock).mockResolvedValue({
            _id: "507f1f77bcf86cd799439011",
            email: "test-email",
            password: "test-password-hashed"
        });
        (jwt.sign as jest.Mock).mockResolvedValue("test-jwt-token");
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);

        const res = await request(app).post("/api/auth/login").send({
            email: "test-email",
            password: "test-password"
        });

        expect(res.status).toBe(201);
        expect(res.body.data.token).toBeDefined();
    });
});

describe("forgot password event", () => {
    it("shoul return 404 if user not found", async () => {
        (User.findOne as jest.Mock).mockResolvedValue(null);

        const res = await request(app).post("/api/auth/forgot-password").send({
            email: "test-email"
        });

        expect(res.status).toBe(404);
        expect(res.body.error.code).toBe(ErrorCodes.USER_NOT_FOUND);
    });
    it("should return email sending is success message if user is exists", async () => {
        (User.findOne as jest.Mock).mockResolvedValue({
            _id: "507f1f77bcf86cd799439011"
        });

        (sendMail as jest.Mock).mockResolvedValue(true);

        const res = await request(app).post("/api/auth/forgot-password").send({
            email: "test-email"
        });

        expect(res.status).toBe(200);
        expect(res.body.data.message).toBeDefined();
    });
});

describe("reset password event", () => {
    it("shuld return 404 if user is not exists", async () => {
        (User.findById as jest.Mock).mockResolvedValue(null);
        (jwt.verify as jest.Mock).mockImplementation(() => ({
            userId: "507f1f77bcf86cd799439011"
        }));

        const res = await request(app)
            .post("/api/auth/reset-password?resetToken=test-reset-token")
            .send({
                newPassword: "test-new-password"
            });

        expect(res.status).toBe(404);
        expect(res.body.error.code).toBe(ErrorCodes.USER_NOT_FOUND);
    });
    it("should return 201 if reset is success", async () => {
        (User.findById as jest.Mock).mockResolvedValue({
            _id: "507f1f77bcf86cd799439011",
            save: jest.fn().mockResolvedValue({
                _id: "507f1f77bcf86cd799439011",
                username: "test-username",
                email: "test-email"
            })
        });
        (jwt.verify as jest.Mock).mockImplementation(() => ({
            userId: "507f1f77bcf86cd799439011"
        }));
        (bcrypt.hash as jest.Mock).mockResolvedValue("test-password-hashed");

        const res = await request(app)
            .post("/api/auth/reset-password?resetToken=test-reset-token")
            .send({
                newPassword: "test-new-password"
            });

        expect(res.status).toBe(201);
        expect(res.body.data.token).toBeDefined();
    });
});
