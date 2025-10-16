import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Protect specific routes with authentication
export default withAuth(
  // Custom logic for role-based access
  function middleware(req) {
    const token = req.nextauth.token;
    console.log(token);

    // Example 1: Only owners can access /owner routes
    if (req.nextUrl.pathname.startsWith("/owner") && token?.role !== "owner") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    // Example 2: Only tenants can access /tenant routes
    if (req.nextUrl.pathname.startsWith("/tenant") && token?.role !== "tenant") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    // Example 3: Prevent logged-in users from going back to /auth/sign-in
    if (
      req.nextUrl.pathname.startsWith("/auth/sign-in") &&
      token
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Apply middleware only if the user has a valid session
      authorized: ({ token }) => !!token,
    },
  }
);

// Apply middleware to specific routes only
export const config = {
  matcher: [
    "/owner/:path*",   // Protect all /owner routes
    "/tenant/:path*",  // Protect all /tenant routes
    "/dashboard/:path*", // Protect dashboard routes
  ],
};
