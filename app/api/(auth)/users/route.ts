import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@/lib/db";
import User from "@/models/user";

// Importing ObjectId from mongoose
const objectId = require("mongoose").Types.ObjectId;

/**
 * GET method to fetch all users.
 * @param {NextRequest} request - The incoming request object.
 * @returns {NextResponse} - The outgoing response object.
 */
export async function GET(request: NextRequest) {
    try {
        // Connect to the database and Fetch all users.
        await dbConnect(); //
        const users = await User.find();

        // Return the users.
        return new NextResponse(JSON.stringify(users), { status: 200 });
    } catch (error: any) {
        // Failed to fetch users.
        return new NextResponse(
            JSON.stringify({
                message: "Error in fetching users!",
                detail: error.message,
            }),
            {
                status: 500,
            }
        );
    }
}

/**
 * POST method to create a new user.
 * @param {NextRequest} request - The incoming request object.
 * @returns {NextResponse} - The outgoing response object.
 */
export async function POST(request: NextRequest) {
    try {
        // Parse the request body.
        const body = await request.json();

        // Connect to the database.
        await dbConnect();

        // Create and save new user.
        const newUser = new User(body);
        await newUser.save();

        // User successfully created.
        return new NextResponse(
            JSON.stringify({
                message: "User is created!",
                user: newUser,
            }),
            { status: 201 }
        );
    } catch (error: any) {
        // Failed to create user.
        return new NextResponse(
            JSON.stringify({
                message: "Error in creating user!",
                detail: error.message,
            }),
            {
                status: 500,
            }
        );
    }
}

/**
 * PATCH method to update a user.
 * @param {NextRequest} request - The incoming request object.
 * @returns {NextResponse} - The outgoing response object.
 */
export async function PATCH(request: NextRequest) {
    try {
        // Get the user id from the request parameters.
        const userId = request.nextUrl.searchParams.get("userId");

        // Extract the new username from the request body.
        const body = await request.json();
        const { username } = body;

        // Check if the user id or new username is not provided.
        if (!userId || !username) {
            return new NextResponse(
                JSON.stringify({
                    message: "Id or new username not found!",
                }),
                {
                    status: 404,
                }
            );
        }

        // Check if the user id is not a valid ObjectId.
        if (!Types.ObjectId.isValid(userId)) {
            return new NextResponse(
                JSON.stringify({
                    message: "Invalid user id",
                }),
                {
                    status: 400,
                }
            );
        }

        // Connect and Update the user with the new username.
        await dbConnect();

        const updatedUser = await User.findOneAndUpdate(
            { _id: new objectId(userId) },
            { username: username },
            { new: true }
        );

        // Check if the user is not found.
        if (!updatedUser) {
            return new NextResponse(
                JSON.stringify({
                    message: "User not found!",
                }),
                {
                    status: 404,
                }
            );
        }

        // User patched successfully.
        return new NextResponse(
            JSON.stringify({
                message: "User is updated!",
                user: updatedUser,
            }),
            {
                status: 200,
            }
        );
    } catch (error: any) {
        // Failed to patched the user.
        return new NextResponse(
            JSON.stringify({
                message: "Error in updating user!",
                detail: error.message,
            }),
            {
                status: 500,
            }
        );
    }
}

/**
 * DELETE method for user deletion.
 * This method is used to delete a user from the database.
 * @param {Request} request - The request object from the client.
 * @returns {NextResponse} The response object to be sent to the client.
 */
export async function DELETE(request: Request) {
    try {
        // Extract user id from the request URL.
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        // Check if user ID is valid,
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

        await dbConnect();

        // Delete the user from the database.
        const deletedUser = await User.findByIdAndDelete(
            new Types.ObjectId(userId)
        );

        // If the user does not exist, return a 404 error.
        if (!deletedUser) {
            return new NextResponse(
                JSON.stringify({
                    message: "User not found!",
                }),
                {
                    status: 404,
                }
            );
        }

        // Uer is successfully deleted.
        return new NextResponse(
            JSON.stringify({
                message: "User is deleted!",
                user: deletedUser,
            }),
            {
                status: 200,
            }
        );
    } catch (error: any) {
        // If there is any error in deleting the user.
        return new NextResponse(
            JSON.stringify({
                message: "Error in deleting user!",
                detail: error.message,
            }),
            {
                status: 500,
            }
        );
    }
}
