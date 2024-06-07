import Category from "@/models/category";

import { NextRequest, NextResponse } from "next/server";
import { handleError, validateAndFetchData } from "@/utils/dbUtils";

export async function PATCH(
    request: NextRequest,
    context: { params: { categoryId: string } }
) {
    try {
        // Extract user and category ID.
        const { categoryId } = context.params;
        const userId = request.nextUrl.searchParams.get("userId");

        // Validate and fetch user and category
        const { error } = await validateAndFetchData(userId!, categoryId);
        if (error) return error;

        // Extract category data from request body
        const { title, description } = await request.json();
        if (!title || !description) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid input data" }),
                { status: 400 }
            );
        }

        // Update category in database
        const updatedCategory = await Category.findByIdAndUpdate(
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
        return handleError(error, "Error in updating category:");
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

        // Validate and fetch user and category
        const { error } = await validateAndFetchData(userId!, categoryId);
        if (error) return error;

        // Delete category in database
        await Category.findByIdAndDelete(categoryId);

        return new NextResponse(
            JSON.stringify({ message: "Category deleted successfully!" }),
            { status: 200 }
        );
    } catch (error: any) {
        return handleError(error, "Error in deleting category:");
    }
}
