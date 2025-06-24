import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";

const generateToken = (userId: string, username: string) => {
    return jwt.sign({ userId, username }, process.env.JWT_SECRET, {
        expiresIn: "7d"
    });
};

export const register = async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email alredy in use" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ username, email, password: hashedPassword });
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
            return res.status(401).json({ message: "Invalid credential1s" });
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
