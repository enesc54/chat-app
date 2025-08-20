import mongoose, { Schema, Document, Types } from "mongoose";

export interface IFile extends Document {
    name: string;
    url: string;
    size: number;
    uploaded_by: Types.ObjectId;
    uploaded_at: Date;
}

const fileSchema = new Schema<IFile>({
    name: { type: String, required: true },
    url: { type: String, required: true },
    size: { type: Number, required: true },
    uploaded_by: { type: Schema.Types.ObjectId, ref: "User", required: true },
    uploaded_at: { type: Date, default: new Date() }
});

export const File = mongoose.model("File", fileSchema);
