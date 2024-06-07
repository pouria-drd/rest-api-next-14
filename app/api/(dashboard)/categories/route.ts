import dbConnect from "@/lib/db";

import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { handleError, isUserExists } from "@/utils/dbUtils";

export async function GET(request: NextRequest) {
    try {
        // Get the user id from the request parameters.
        const userId = request.nextUrl.searchParams.get("userId");

        // User validation.
        const isUser = await isUserExists(userId!);

        if (!isUser) {
            return new NextResponse(
                JSON.stringify({
                    message: "User not found!",
                }),
                { status: 404 }
            );
        }

        // Fined and return all categories of current user.
        await dbConnect();
        const categories = await (
            await import("@/models/category")
        ).default.find({
            user: new Types.ObjectId(userId!),
        });

        return new NextResponse(JSON.stringify({ categories: categories }), {
            status: 200,
        });
    } catch (error: any) {
        return handleError(error, "Error in fetching category!");
    }
}
export async function POST(request: NextRequest) {
    try {
        // Get the user id from the request parameters.
        const userId = request.nextUrl.searchParams.get("userId");

        // User validation.
        const isUser = await isUserExists(userId!);

        if (!isUser) {
            return new NextResponse(
                JSON.stringify({
                    message: "User not found!",
                }),
                { status: 404 }
            );
        }

        // Extract category data from request body.
        const { title, description } = await request.json();

        // Connect to database and Create new Category.
        await dbConnect();
        const { default: Category } = await import("@/models/category");
        const newCategory = new Category({
            title: title,
            description: description,
            user: new Types.ObjectId(userId!),
        });

        await newCategory.save();

        return new NextResponse(
            JSON.stringify({
                message: "Category created successfully!",
                category: newCategory,
            }),
            {
                status: 201,
            }
        );
    } catch (error: any) {
        return handleError(error, "Failed to create category!");
    }
}
