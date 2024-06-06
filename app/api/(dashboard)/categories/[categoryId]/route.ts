import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@/lib/db";
import User from "@/models/user";
import Category from "@/models/category";

export async function PATCH(request: NextRequest, context: { params: any }) {
    try {
        // Get the category id from the request parameters.
        const categoryId = context.params.categoryId;

        // Check if category ID is valid.
        if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
            return new NextResponse(
                JSON.stringify({
                    message: "Invalid or missing categoryId",
                }),
                {
                    status: 400,
                }
            );
        }

        // Get the user id from the request parameters.
        const userId = request.nextUrl.searchParams.get("userId");

        // Check if user ID is valid.
        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(
                JSON.stringify({
                    message: "Invalid or missing userId",
                }),
                {
                    status: 400,
                }
            );
        }

        // Connect to db.
        await dbConnect();

        // Try to find user.
        const user = await User.findById(userId);

        // If the user does not exist, return 404 error.
        if (!user) {
            return new NextResponse(
                JSON.stringify({
                    message: "User not found!",
                }),
                {
                    status: 404,
                }
            );
        }

        // Try to find correct category.
        const category = Category.findOne({ _id: categoryId, user: userId });

        // If the category does not exist, return 404 error.
        if (!category) {
            return new NextResponse(
                JSON.stringify({
                    message: "Category not found!",
                }),
                {
                    status: 404,
                }
            );
        }

        // Extract category data from request body.
        const { title, description } = await request.json();

        const updatedCategory = await Category.findByIdAndUpdate(
            categoryId,
            { title, description },
            { new: true }
        );

        return new NextResponse(
            JSON.stringify({
                message: "Category updated successfully!",
                category: JSON.stringify(updatedCategory),
            }),
            {
                status: 200,
            }
        );
    } catch (error: any) {
        // Failed to update category.
        return new NextResponse(
            JSON.stringify({
                message: "Error in updating category!",
                detail: error.message,
            }),
            {
                status: 500,
            }
        );
    }
}
