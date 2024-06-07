import dbConnect from "@/lib/db";

import { NextRequest, NextResponse } from "next/server";
import { isCategoryExits, handleError } from "@/utils/dbUtils";

export async function PATCH(
    request: NextRequest,
    context: { params: { categoryId: string } }
) {
    try {
        // Extract user and category ID.
        const { categoryId } = context.params;
        const userId = request.nextUrl.searchParams.get("userId");

        // Category validation.
        const isCategory = await isCategoryExits(categoryId, userId!);

        if (!isCategory) {
            return new NextResponse(
                JSON.stringify({
                    message: "Category not found!",
                }),
                { status: 404 }
            );
        }

        // Extract category data from request body.
        const { title, description } = await request.json();

        // Connect to the database and Update the category information.
        await dbConnect();

        const updatedCategory = await (
            await import("@/models/category")
        ).default.findByIdAndUpdate(
            categoryId,
            { title, description },
            { new: true }
        );

        return new NextResponse(
            JSON.stringify({
                message: "Category updated successfully!",
                category: updatedCategory,
            }),
            { status: 200 }
        );
    } catch (error: any) {
        return handleError(error, "Error in updating category!");
    }
}

export async function DELETE(
    request: NextRequest,
    context: { params: { categoryId: string } }
) {
    try {
        // Extract user and category ID.
        const { categoryId } = context.params;
        const userId = request.nextUrl.searchParams.get("userId");

        // Category validation.
        const isCategory = await isCategoryExits(categoryId, userId!);

        if (!isCategory) {
            return new NextResponse(
                JSON.stringify({
                    message: "Category not found!",
                }),
                { status: 404 }
            );
        }

        // Connect to the database and Delete the category.
        await dbConnect();

        await (
            await import("@/models/category")
        ).default.findByIdAndDelete(categoryId);

        return new NextResponse(
            JSON.stringify({ message: "Category deleted successfully!" }),
            { status: 200 }
        );
    } catch (error: any) {
        return handleError(error, "Error in deleting category:");
    }
}
