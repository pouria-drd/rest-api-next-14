import { Schema, models, model } from "mongoose";

const CategorySchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: "User" },

        title: { type: "string", maxlength: 100, required: true },
        description: { type: "string", maxlength: 255 },
    },
    {
        timestamps: true,
    }
);

const Category = models.Category || model("Category", CategorySchema);

export default Category;
