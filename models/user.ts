import { Schema, models, model } from "mongoose";

const UserSchema = new Schema(
    {
        email: { type: "string", maxlength: 100, required: true, unique: true },
        username: {
            type: "string",
            maxlength: 100,
            required: true,
            unique: true,
        },
        password: { type: "string", required: true },
    },
    {
        timestamps: true,
    }
);

const User = models.User || model("User", UserSchema);

export default User;
