import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("Mongo Uri is not defined");
        }
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected");
    } catch (err) {
        console.log("MongoDB connection failed");
        process.exit(1);
    }
};
