import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../models/user.model";
import { sendMail } from "../config/mail";

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
            return res.status(400).json({ message: "Email alredy in use" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            fullname,
            username,
            email,
            password: hashedPassword
        });
        await newUser.save();

        const token = generateToken(newUser._id.toString(), newUser.username);

        return res.status(201).json({
            user: {
                userId: newUser._id,
                username: newUser.username,
                email: newUser.email
            },
            token
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        if (!(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = generateToken(user._id.toString(), user.username);

        return res.status(201).json({
            user: {
                userId: user._id,
                username: user.username,
                email: user.email
            },
            token
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error });
    }
};

export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
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

        return res.status(200).json({ message: "Email sending is succesful" });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error });
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
        if (!user) return res.status(404).json({ message: "User not found" });

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;

        await user.save();

        const token = generateToken(user._id.toString(), user.username);

        return res.status(201).json({
            user: {
                userId: user._id,
                username: user.username,
                email: user.email
            },
            token
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error });
    }
};
