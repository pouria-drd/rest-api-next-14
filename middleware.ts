import { NextResponse } from "next/server";
import { authMiddleware } from "./middlewares/api/authMiddleware";

export const config = {
    matcher: "/api/:path*",
};

export default function middleware(request: Request) {
    const authResult = authMiddleware(request);
    // specific route && request.url.includes("/api/blogs")
    if (!authResult.isValid) {
        return new NextResponse(
            JSON.stringify({
                message: "Unauthorized",
            }),
            {
                status: 401,
            }
        );
    }

    return NextResponse.next();
}
