import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@/lib/db";
import User from "@/models/user";
import Category from "@/models/category";

export async function GET(request: NextRequest) {
    try {
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

        // Try to stablish a connection to database and find user.
        await dbConnect();
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

        // Fined and return all categories of current user.
        const categories = await Category.find({
            user: new Types.ObjectId(userId),
        });

        return new NextResponse(JSON.stringify({ categories: categories }), {
            status: 200,
        });
    } catch (error: any) {
        // Failed to fetch categories.
        return new NextResponse(
            JSON.stringify({
                message: "Error in fetching categories!",
                detail: error.message,
            }),
            {
                status: 500,
            }
        );
    }
}
export async function POST(request: NextRequest) {
    try {
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

        // Extract category data from request body.
        const { title, description } = await request.json();

        // Connect to database and find the user.
        await dbConnect();
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

        // Create new Category.
        const newCategory = new Category({
            title: title,
            description: description,
            user: new Types.ObjectId(userId),
        });

        await newCategory.save();

        return new NextResponse(JSON.stringify({ category: newCategory }), {
            status: 201,
        });
    } catch (error: any) {
        // Failed to create new category.
        return new NextResponse(
            JSON.stringify({
                message: "Failed to create category!",
                detail: error.message,
            }),
            {
                status: 500,
            }
        );
    }
}
