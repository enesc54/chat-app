import mongoose, { Schema, Document, Types } from "mongoose";

export interface IUser extends Document {
    _id: Types.ObjectId;
    fullname: string;
    username: string;
    email: string;
    password: string;
}

const userSchema = new Schema<IUser>(
    {
        fullname: { type: String, required: true, unique: false },
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true }
    },
    { timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);
