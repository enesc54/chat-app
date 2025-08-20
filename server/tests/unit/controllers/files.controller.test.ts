import request from "supertest";
import express, { Express } from "express";
import { verifyToken } from "../../../src/middlewares/auth.middleware";
import { File as FileModel } from "../../../src/models/file.model";
import { ErrorCodes, ErrorMessages } from "../../../src/types/response.types";
import filesRouter from "../../../src/routes/files.routes";
import { supabase, upload } from "../../../src/config/supabase";
import path from "path";

const filePath = path.join(__dirname, "../../fixtures/file.jpg");

const saveMock = jest.fn().mockResolvedValue({
    _id: "507f1f77bcf86cd799439011",
    name: "file.jpg",
    url: "https://supabase.fake/files/uuid-file.jpg",
    size: 1234,
    upload_by: "507f1f77bcf86cd799439011"
});

const mockFileInstance = {
    save: saveMock
};

jest.mock("../../../src/models/file.model", () => ({
    File: Object.assign(
        jest.fn(() => mockFileInstance),
        {
            findOne: jest.fn()
        }
    )
}));
jest.mock("../../../src/middlewares/auth.middleware");
jest.mock("../../../src/config/supabase", () => {
    const multer = require("multer");
    return {
        supabase: {
            storage: {
                from: jest.fn().mockReturnValue({
                    upload: jest.fn(),
                    getPublicUrl: jest.fn()
                })
            }
        },
        upload: multer({ storage: multer.memoryStorage() })
    };
});

let app: Express;
const mockedVerifyToken = verifyToken as jest.Mock;

beforeAll(() => {
    app = express();

    app.use(express.json());
    app.use("/api/files", filesRouter);

    mockedVerifyToken.mockImplementation((req, _res, next) => {
        req.user = { userId: "507f1f77bcf86cd799439011" };
        next();
    });
});

beforeEach(() => {
    jest.clearAllMocks();
});

describe("uploadFile event", () => {
    it("should return 400 if there is no file in request", async () => {
        const res = await request(app).post("/api/files/upload").send();

        expect(res.status).toBe(400);
        expect(res.body.error.code).toBe(ErrorCodes.FILE_NOT_UPLOADED);
    });
    it("should return 400 if supabase upload error", async () => {
        (
            supabase.storage.from("files").upload as jest.Mock
        ).mockResolvedValueOnce({
            data: null,
            error: new Error("upload error")
        });
        const res = await request(app)
            .post("/api/files/upload")
            .attach("file", filePath);

        expect(res.status).toBe(400);
        expect(res.body.error.code).toBe(ErrorCodes.FILE_NOT_UPLOADED);
    });
    it("should return dbFile if upload is successful", async () => {
        (
            supabase.storage.from("files").upload as jest.Mock
        ).mockResolvedValueOnce({
            data: {
                path: "uuid-file.jpg"
            },
            error: null
        });
        (
            supabase.storage.from("files").getPublicUrl as jest.Mock
        ).mockReturnValue({
            data: {
                publicUrl: "https://supabase.fake/files/uuid-file.jpg"
            }
        });

        const res = await request(app)
            .post("/api/files/upload")
            .attach("file", filePath);

        expect(res.status).toBe(200);
        expect(res.body.data.name).toBe("file.jpg");
        expect(res.body.data.url).toBe(
            "https://supabase.fake/files/uuid-file.jpg"
        );
    });
});

describe("getFileInfo", () => {
    it("should return 400 if fileId is invalid", async () => {
        const res = await request(app).get("/api/files/invalid-id");

        expect(res.status).toBe(400);
        expect(res.body.error.code).toBe(ErrorCodes.FILE_NOT_FOUND);
    });
    it("should return 400 if file not exists in db", async () => {
        const res = await request(app).get(
            "/api/files/507f1f77bcf86cd799439011"
        );

        expect(res.status).toBe(400);
        expect(res.body.error.code).toBe(ErrorCodes.FILE_NOT_FOUND);
    });
    it("should return file info if file exists in db", async () => {
        (FileModel.findOne as jest.Mock).mockResolvedValueOnce({
            _id: "507f1f77bcf86cd799439011",
            name: "test-file-name"
        });

        const res = await request(app).get(
            "/api/files/507f1f77bcf86cd799439011"
        );

        expect(res.status).toBe(200);
        expect(res.body.data.name).toBe("test-file-name");
    });
});
