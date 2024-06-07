import { Types } from "mongoose";
import { NextResponse } from "next/server";

/**
 * Checks if a given string is a valid MongoDB ObjectId.
 *
 * @param id - The string to be checked.
 * @returns A boolean indicating whether the string is a valid ObjectId.
 */
export const isValidObjectId = (id: string) => {
    const isValid = id && Types.ObjectId.isValid(id);
    return isValid;
};

/**
 * Checks if a user with the given ID exists in the database.
 *
 * @param userId - The ID of the user to be checked.
 * @returns A boolean indicating whether the user exists.
 */
export const isUserExists = async (userId: string) => {
    // Validate the userId format.
    if (!isValidObjectId(userId)) {
        return false;
    }

    // Dynamically import the User model and check if the user exists.
    const user = await (await import("@/models/user")).default.findById(userId);

    if (!user) return false;

    return true;
};

/**
 * Checks if a category with the given ID exists for the specified user in the database.
 *
 * @param categoryId - The ID of the category to be checked.
 * @param userId - The ID of the user who owns the category.
 * @returns A boolean indicating whether the category exists for the user.
 */
export const isCategoryExits = async (categoryId: string, userId: string) => {
    // Validate the categoryId and userId formats.
    if (!isValidObjectId(categoryId)) {
        return false;
    }

    if (!isValidObjectId(userId)) {
        return false;
    }

    // Dynamically import the Category model and check if the category exists for the user.
    const category = await (
        await import("@/models/category")
    ).default.findOne({ _id: categoryId, user: userId });

    if (!category) {
        return false;
    }

    return true;
};

/**
 * Handles errors by logging them and returning a standardized error response.
 *
 * @param error - The error object.
 * @param message - An optional custom error message.
 * @returns A NextResponse object with a JSON error message and a 500 status code.
 */
export const handleError = (error: any, message: string) => {
    console.error(message, error);
    return new NextResponse(
        JSON.stringify({
            message: message || error.message,
        }),
        { status: 500 }
    );
};
