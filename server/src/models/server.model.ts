import mongoose, { Schema, Document, Types } from "mongoose";

export interface IServerRole {
    _id: Types.ObjectId;
    name: string;
}

export interface IServerMember {
    userId: Types.ObjectId;
    role: Types.ObjectId;
}

export interface IServer extends Document {
    name: string;
    logo?: string;
    banner?: string;
    owner: Types.ObjectId;
    members: IServerMember[];
    roles: IServerRole[];
}

const serverSchema = new Schema<IServer>(
    {
        name: { type: String, required: true },
        logo: { type: String },
        banner: { type: String },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        members: [
            {
                userId: {
                    type: Schema.Types.ObjectId,
                    ref: "User",
                    required: true
                },
                role: { type: Schema.Types.ObjectId, required: true }
            }
        ],
        roles: [
            {
                _id: { type: Schema.Types.ObjectId, auto: true },
                name: { type: String, required: true }
            }
        ]
    },
    { timestamps: true }
);

export const Server = mongoose.model<IServer>("Server", serverSchema);
