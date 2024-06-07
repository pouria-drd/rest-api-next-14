import dbConnect from "@/lib/db";
import User from "@/models/user";
import Category from "@/models/category";

import { Types } from "mongoose";
import { NextResponse } from "next/server";

/**
 * Checks if the provided string is a valid ObjectId.
 * @param id - The string to check.
 * @returns A boolean indicating whether the provided string is a valid ObjectId.
 */
export const isValidObjectId = (id: string) => {
    return id && Types.ObjectId.isValid(id);
};

/**
 * Fetches a user by their ID.
 * @param userId - The ID of the user to fetch.
 * @returns A NextResponse with an error message and status if invalid, or an object containing the user data if valid.
 */
export const fetchUserById = async (userId: string) => {
    // Validate the userId
    if (!isValidObjectId(userId)) {
        return new NextResponse(
            JSON.stringify({ message: "Invalid or missing userId!" }),
            { status: 400 }
        );
    }

    // Fetch the user from the database.
    const user = await User.findById(userId);
    if (!user) {
        return new NextResponse(
            JSON.stringify({ message: "User not found!" }),
            {
                status: 404,
            }
        );
    }

    // Return the user data.
    return { user };
};

/**
 * Fetches a category by its ID and the user ID.
 * @param categoryId - The ID of the category to fetch.
 * @param userId - The ID of the user who owns the category.
 * @returns A NextResponse with an error message and status if invalid, or an object containing the category data if valid.
 */
export const fetchCategory = async (categoryId: string, userId: string) => {
    // Validate the categoryId
    if (!isValidObjectId(categoryId)) {
        return new NextResponse(
            JSON.stringify({ message: "Invalid or missing categoryId!" }),
            { status: 400 }
        );
    }

    // Fetch the category from the database.
    const category = await Category.findOne({ _id: categoryId, user: userId });
    if (!category) {
        return new NextResponse(
            JSON.stringify({ message: "Category not found!" }),
            { status: 404 }
        );
    }

    // Return the category data.
    return { category };
};

export const validateAndFetchData = async (
    userId: string,
    categoryId: string
) => {
    // Connect to the database
    await dbConnect();

    // Validate and fetch user and category
    const userResponse = await fetchUserById(userId);
    if (userResponse instanceof NextResponse) return { error: userResponse };

    const categoryResponse = await fetchCategory(categoryId, userId);
    if (categoryResponse instanceof NextResponse)
        return { error: categoryResponse };

    return { user: userResponse.user, category: categoryResponse.category };
};

export const handleError = (error: any, message: string) => {
    console.error(message, error);
    return new NextResponse(
        JSON.stringify({
            message: error.message || message,
        }),
        { status: 500 }
    );
};
