import { Schema, models, model } from "mongoose";

const BlogSchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        category: { type: Schema.Types.ObjectId, ref: "Category" },

        title: { type: "string", maxlength: 100, required: true },
        description: { type: "string", maxlength: 255 },
    },
    {
        timestamps: true,
    }
);

const Blog = models.Blog || model("Blog", BlogSchema);

export default Blog;
