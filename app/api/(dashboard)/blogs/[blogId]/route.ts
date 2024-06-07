import dbConnect from "@/lib/db";

import { isValidObjectId, Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { isBlogExits, handleError, isUserExists } from "@/utils/dbUtils";

export async function GET(
    request: NextRequest,
    context: { params: { blogId: string } }
) {
    try {
        // Extract user, category and blog ID.
        const { blogId } = context.params;

        const userId = request.nextUrl.searchParams.get("userId");
        const categoryId = request.nextUrl.searchParams.get("categoryId");

        // Blog validation.
        const isBlog = await isBlogExits(userId!, categoryId!, blogId);

        if (!isBlog) {
            return new NextResponse(
                JSON.stringify({
                    message: "Blog not found!",
                }),
                { status: 404 }
            );
        }

        // Find and return blog of current user and category.
        await dbConnect();
        const blog = await (
            await import("@/models/blog")
        ).default.findOne({
            _id: blogId,
            user: userId,
            category: categoryId,
        });

        if (!blog) {
            return new NextResponse(
                JSON.stringify({ message: "Blog not found!" }),
                {
                    status: 404,
                }
            );
        }

        return new NextResponse(JSON.stringify({ blog: blog }), {
            status: 200,
        });
    } catch (error: any) {
        return handleError(error, "Error in fetching a blog!");
    }
}

export async function PATCH(
    request: NextRequest,
    context: { params: { blogId: string } }
) {
    try {
        // Extract user, category and blog ID.
        const { blogId } = context.params;

        const userId = request.nextUrl.searchParams.get("userId");

        // Validate blogID.
        const isBlogId = isValidObjectId(blogId);

        if (!isBlogId) {
            return new NextResponse(
                JSON.stringify({
                    message: "BLog not found!",
                }),
                { status: 404 }
            );
        }

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

        // Find and update blog of current user and category.
        await dbConnect();
        const blog = await (
            await import("@/models/blog")
        ).default.findOne({
            _id: blogId,
            user: userId,
        });

        if (!blog) {
            return new NextResponse(
                JSON.stringify({ message: "Blog not found!" }),
                {
                    status: 404,
                }
            );
        }

        // Extract blog data from request body.
        const { title, description } = await request.json();

        const updatedBlog = await (
            await import("@/models/blog")
        ).default.findByIdAndUpdate(
            blogId,
            { title, description },
            { new: true }
        );

        return new NextResponse(
            JSON.stringify({ message: "Blog is updated!", blog: updatedBlog }),
            {
                status: 200,
            }
        );
    } catch (error: any) {
        return handleError(error, "Error updating blog!");
    }
}

export async function DELETE(
    request: NextRequest,
    context: { params: { blogId: string } }
) {
    try {
        // Extract user and blog ID.
        const { blogId } = context.params;
        const userId = request.nextUrl.searchParams.get("userId");

        // Validate blogID.
        const isBlogId = isValidObjectId(blogId);

        if (!isBlogId) {
            return new NextResponse(
                JSON.stringify({
                    message: "BLog not found!",
                }),
                { status: 404 }
            );
        }

        // Connect to the database and Delete the category.
        await dbConnect();

        await (await import("@/models/blog")).default.findByIdAndDelete(blogId);

        return new NextResponse(
            JSON.stringify({ message: "Blog deleted successfully!" }),
            { status: 200 }
        );
    } catch (error: any) {
        return handleError(error, "Error in deleting category:");
    }
}
