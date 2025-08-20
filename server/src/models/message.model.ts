import mongoose, { Schema, Document, Types } from "mongoose";
import { MessageContentType } from "../types/message.types";

export interface IMessageContent {
    type: MessageContentType;
    data: string;
    fileId?: Types.ObjectId;
}

export interface IMessage extends Document {
    roomId: Types.ObjectId;
    senderId: Types.ObjectId;
    content: IMessageContent;
    createdAt: Date;
    updatedAt: Date;
}

const contentSchema = new Schema<IMessageContent>({
    type: {
        type: String,
        enum: Object.values(MessageContentType),
        required: true
    },
    data: { type: String, required: true },
    fileId: {type: Schema.Types.ObjectId,ref: "File"
    }
});

const messageSchema = new Schema<IMessage>(
    {
        roomId: { type: Schema.Types.ObjectId, ref: "Room", required: true },
        senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        content: { type: contentSchema, required: true }
    },
    { timestamps: true }
);

export const Message = mongoose.model<IMessage>("Message", messageSchema);
