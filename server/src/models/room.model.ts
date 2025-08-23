import mongoose, { Schema, Document, Types } from "mongoose";
import { IRoomPermissions } from "../types/room.types";

export interface IRoom extends Document {
    name: string;
    type: "text" | "voice";
    serverId: Types.ObjectId;
    categoryId: Types.ObjectId;
    permissions: IRoomPermissions[];
}

const roomSchema = new Schema<IRoom>({
    name: { type: String, required: true },
    type: { type: String, enum: ["text", "voice"], default: "text" },
    serverId: { type: Schema.Types.ObjectId, ref: "Server", required: true },
    categoryId: { type: Schema.Types.ObjectId, required: true },
    permissions: [
        {
            roleId: { type: Schema.Types.ObjectId, required: true },
            canAccess: { type: Boolean, default: true },
            canSendMessage: { type: Boolean, default: false },
            canSpeak: { type: Boolean, default: false }
        }
    ]
});

export const Room = mongoose.model<IRoom>("Room", roomSchema);
