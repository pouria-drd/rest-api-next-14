import { NextResponse } from "next/server";
import { authMiddleware } from "./middlewares/api/authMiddleware";
import { logMiddleware } from "./middlewares/logMiddleware";

export const config = {
    matcher: "/api/:path*",
};

export default function middleware(request: Request) {
    // specific route && request.url.includes("/api/blogs")

    const logResult = logMiddleware(request);
    console.log("\n----- New Request -----");
    console.log(logResult);

    const authResult = authMiddleware(request);

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
