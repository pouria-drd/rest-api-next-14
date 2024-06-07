import { NextRequest, NextResponse } from "next/server";
import { isUserExists, isCategoryExits, handleError } from "@/utils/dbUtils";

export async function PATCH(
    request: NextRequest,
    context: { params: { categoryId: string } }
) {
    try {
        // Extract user and category ID.
        const { categoryId } = context.params;
        const userId = request.nextUrl.searchParams.get("userId");

        // User validation.
        const isUser = await isUserExists(userId!);

        if (!isUser) {
            return new NextResponse(
                JSON.stringify({
                    message: "User with specified userId not found!",
                }),
                { status: 404 }
            );
        }

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

        // Update category information.
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

        // User validation.
        const isUser = await isUserExists(userId!);

        if (!isUser) {
            return new NextResponse(
                JSON.stringify({
                    message: "User with specified userId not found!",
                }),
                { status: 404 }
            );
        }

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

        // Delete category in database.
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
