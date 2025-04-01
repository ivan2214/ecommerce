import { type NextRequest, NextResponse } from "next/server";
import { verifyEmailAction } from "@/lib/auth/actions";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(
      new URL("/auth/verification-failed", request.url)
    );
  }

  // Call the server action
  return verifyEmailAction(token);
}
