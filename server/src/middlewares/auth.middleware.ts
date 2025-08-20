import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { CustomRequest } from "../types/request.types";

export const verifyToken = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized: No tokens" });
    }

    const token = authHeader.split(" ")[1];

    try {
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined");
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (typeof decoded === "string") {
            throw new Error("Token payload cannot be string");
        }
        (req as CustomRequest).user = decoded;

        next();
    } catch (err) {
        return res
            .status(401)
            .json({ message: "Unauthorized: Token is invalid." });
    }
};
