import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../models/user.model";
import { sendMail } from "../config/mail";
import {
    IApiResponse,
    ErrorCodes,
    ErrorMessages,
    IAuthSuccessResponse
} from "../types/response.types";

const generateToken = (userId: string, username: string) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
    }
    return jwt.sign({ userId, username }, process.env.JWT_SECRET, {
        expiresIn: "7d"
    });
};

export const register = async (req: Request, res: Response) => {
    try {
        const { fullname, username, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json(<IApiResponse>{
                success: false,
                error: {
                    code: ErrorCodes.EMAIL_IN_USE,
                    message: ErrorMessages[ErrorCodes.EMAIL_IN_USE]
                }
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            fullname,
            username,
            email,
            password: hashedPassword
        });
        const savedUser = await newUser.save();

        const token = generateToken(
            savedUser._id.toString(),
            savedUser.username
        );

        const response: IApiResponse<IAuthSuccessResponse> = {
            success: true,
            data: {
                user: {
                    userId: savedUser._id.toString(),
                    username: savedUser.username,
                    email: savedUser.email
                },
                token
            }
        };

        return res.status(201).json(response);
    } catch (error) {
        return res.status(500).json(<IApiResponse>{
            success: false,
            error: {
                code: ErrorCodes.API_ERROR,
                message: ErrorMessages[ErrorCodes.API_ERROR]
            }
        });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json(<IApiResponse>{
                success: false,
                error: {
                    code: ErrorCodes.INVALID_CREDENTIALS,
                    message: ErrorMessages[ErrorCodes.USER_NOT_FOUND]
                }
            });
        }

        const token = generateToken(user._id.toString(), user.username);

        const response: IApiResponse<IAuthSuccessResponse> = {
            success: true,
            data: {
                user: {
                    userId: user._id.toString(),
                    username: user.username,
                    email: user.email
                },
                token
            }
        };

        return res.status(201).json(response);
    } catch (error) {
        return res.status(500).json(<IApiResponse>{
            success: false,
            error: {
                code: ErrorCodes.API_ERROR,
                message: ErrorMessages[ErrorCodes.API_ERROR]
            }
        });
    }
};

export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json(<IApiResponse>{
                success: false,
                error: {
                    code: ErrorCodes.USER_NOT_FOUND,
                    message: ErrorMessages[ErrorCodes.USER_NOT_FOUND]
                }
            });
        }

        if (!process.env.PASSWORD_RESET_SECRET) {
            throw new Error("PASSWORD_RESET_SECRET is not defined");
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.PASSWORD_RESET_SECRET,
            { expiresIn: "1h" }
        );

        const resetLink = `http://localhost:5173/reset-password/${token}`;
        await sendMail(
            "Forgot Password",
            `<p><a href="${resetLink}">Click to reset your password</a></p>`,
            email
        );

        const response: IApiResponse<{ message: string }> = {
            success: true,
            data: { message: "Email sending is succesful" }
        };

        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json(<IApiResponse>{
            success: false,
            error: {
                code: ErrorCodes.API_ERROR,
                message: ErrorMessages[ErrorCodes.API_ERROR]
            }
        });
    }
};

export const resetPassword = async (req: Request, res: Response) => {
    try {
        let resetToken = req.query.resetToken;

        if (Array.isArray(resetToken)) {
            resetToken = resetToken[0];
        }

        if (typeof resetToken !== "string") {
            throw new Error("resetToken is not defined");
        }
        const { newPassword } = req.body;

        if (!process.env.PASSWORD_RESET_SECRET) {
            throw new Error("PASSWORD_RESET_SECRET is not defined");
        }

        const decoded = jwt.verify(
            resetToken,
            process.env.PASSWORD_RESET_SECRET
        );

        if (!(typeof decoded === "object" && "userId" in decoded)) {
            throw new Error("Invalid token payload");
        }

        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(404).json(<IApiResponse>{
                success: false,
                error: {
                    code: ErrorCodes.USER_NOT_FOUND,
                    message: ErrorMessages[ErrorCodes.USER_NOT_FOUND]
                }
            });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;

        await user.save();

        const token = generateToken(user._id.toString(), user.username);

        const response: IApiResponse<IAuthSuccessResponse> = {
            success: true,
            data: {
                user: {
                    userId: user._id.toString(),
                    username: user.username,
                    email: user.email
                },
                token
            }
        };

        return res.status(201).json(response);
    } catch (error) {
        return res.status(500).json(<IApiResponse>{
            success: false,
            error: {
                code: ErrorCodes.API_ERROR,
                message: ErrorMessages[ErrorCodes.API_ERROR]
            }
        });
    }
};
