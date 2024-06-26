import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

export default async function dbConnect() {
    const connectionState = mongoose.connection.readyState;

    if (connectionState === 1) {
        console.log("Already connected to db!");
        return;
    }

    if (connectionState === 2) {
        console.log("Connecting to db...");
        return;
    }

    try {
        mongoose.connect(MONGODB_URI!, {
            dbName: "REST-API-Next-14",
            bufferCommands: true,
        });

        console.log("Connected to db!");
    } catch (error: any) {
        console.log("Error :", error);
        throw new Error("Error :", error);
    }
}
