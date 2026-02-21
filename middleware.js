import arcjet, { createMiddleware, detectBot, shield } from "@arcjet/next";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// 🔥 ArcJet setup
const aj = arcjet({
  key: process.env.ARCJET_KEY,
  rules: [
    shield({ mode: "LIVE" }),
    detectBot({
      mode: "LIVE",
      allow: [
        "CATEGORY:SEARCH_ENGINE",
        "GO_HTTP",
      ],
    }),
  ],
});

// 🔥 NextAuth protection
const authMiddleware = withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    pages: {
      signIn: "/login", // redirect to your custom login page
    },
  }
);

// 🔥 Chain: ArcJet first, then NextAuth
export default createMiddleware(aj, authMiddleware);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/account/:path*",
    "/transaction/:path*",
  ],
};