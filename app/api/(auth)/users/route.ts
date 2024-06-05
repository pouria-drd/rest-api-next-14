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
        await dbConnect(); // Connect to the database

        const users = await User.find(); // Fetch all users

        // Return the users in the response with a status of 200
        return new NextResponse(JSON.stringify(users), { status: 200 });
    } catch (error: any) {
        // Return an error message in the response with a status of 500
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
        const body = await request.json(); // Parse the request body

        await dbConnect(); // Connect to the database

        const newUser = new User(body); // Create a new user with the request body
        await newUser.save(); // Save the new user to the database

        // Return a success message in the response with a status of 201
        return new NextResponse(
            JSON.stringify({
                message: "User is created!",
                user: newUser,
            }),
            { status: 201 }
        );
    } catch (error: any) {
        // Return an error message in the response with a status of 500
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
        const userId = request.nextUrl.searchParams.get("id"); // Get the user id from the request parameters

        const body = await request.json();

        const { username } = body; // Extract the new username from the request body

        await dbConnect();

        // Check if the user id or new username is not provided
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

        // Check if the user id is not a valid ObjectId
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

        // Update the user with the new username
        const updatedUser = await User.findOneAndUpdate(
            { _id: new objectId(userId) },
            { username: username },
            { new: true }
        );

        // Check if the user is not found
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
        // Extract search parameters from the request URL
        const { searchParams } = new URL(request.url);
        // Get the user ID from the search parameters
        const userId = searchParams.get("id");

        // If no user ID is provided, return a 404 status code with a message
        if (!userId) {
            return new NextResponse(
                JSON.stringify({
                    message: "Id not found!",
                }),
                {
                    status: 404,
                }
            );
        }

        // If the user ID is not valid, return a 400 status code with a message
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

        await dbConnect();

        // Delete the user from the database
        const deletedUser = await User.findByIdAndDelete(
            new Types.ObjectId(userId)
        );

        // If the user does not exist, return a 404 status code with a message
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

        // If the user is successfully deleted, return a 200 status code with a success message and the deleted user
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
        // If there is an error in deleting the user, return a 500 status code with an error message
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
