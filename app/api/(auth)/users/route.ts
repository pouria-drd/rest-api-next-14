import { NextResponse } from "next/server";

export async function GET(request: Request) {
    return new NextResponse("Users");
}
