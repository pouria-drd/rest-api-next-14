import dbConnect from "@/lib/db";

import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { handleError, isCategoryExits, isUserExists } from "@/utils/dbUtils";

export async function GET(request: NextRequest) {
    try {
        // Get the user and category id from the request parameters.
        const userId = request.nextUrl.searchParams.get("userId");
        const categoryId = request.nextUrl.searchParams.get("categoryId");

        const searchKeywords = request.nextUrl.searchParams.get(
            "keywords"
        ) as string;

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

        // Category validation.
        const isCategory = await isCategoryExits(categoryId!, userId!);

        if (!isCategory) {
            return new NextResponse(
                JSON.stringify({
                    message: "Category not found!",
                }),
                { status: 404 }
            );
        }

        // Find and return all blogs of current user and category.
        const filter: any = {
            user: new Types.ObjectId(userId!),
            category: new Types.ObjectId(categoryId!),
        };

        // Add filters if there are any searchKeywords.
        if (searchKeywords) {
            filter.$or = [
                {
                    title: { $regex: searchKeywords, $options: "i" },
                },
                {
                    description: { $regex: searchKeywords, $options: "i" },
                },
            ];
        }

        // Connect to database and fetch blogs.
        await dbConnect();

        const blogs = await (
            await import("@/models/blog")
        ).default.find(filter);

        return new NextResponse(JSON.stringify({ blogs: blogs }), {
            status: 200,
        });
    } catch (error: any) {
        return handleError(error, "Error in fetching blogs!");
    }
}

export async function POST(request: NextRequest) {
    try {
        // Get the user and category id from the request parameters.
        const userId = request.nextUrl.searchParams.get("userId");
        const categoryId = request.nextUrl.searchParams.get("categoryId");

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

        // Category validation.
        const isCategory = await isCategoryExits(categoryId!, userId!);

        if (!isCategory) {
            return new NextResponse(
                JSON.stringify({
                    message: "Category not found!",
                }),
                { status: 404 }
            );
        }

        // Extract blog data from request body.
        const { title, description } = await request.json();

        // Connect to database and Create new Blog.
        await dbConnect();
        const { default: Blog } = await import("@/models/blog");
        const newBlog = new Blog({
            title: title,
            description: description,
            user: new Types.ObjectId(userId!),
            category: new Types.ObjectId(categoryId!),
        });

        await newBlog.save();

        return new NextResponse(
            JSON.stringify({
                message: "Blog created successfully!",
                blog: newBlog,
            }),
            {
                status: 201,
            }
        );
    } catch (error: any) {
        return handleError(error, "Error in creating blog!");
    }
}
