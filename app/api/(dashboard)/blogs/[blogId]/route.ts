import dbConnect from "@/lib/db";

import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { isBlogExits, handleError } from "@/utils/dbUtils";

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
        // Fined and return blog of current user and category.
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
