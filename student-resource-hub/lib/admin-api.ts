import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";

export async function requireAdminResponse() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export function errorResponse(error: unknown, fallback = "Something went wrong.") {
  // Do not expose database/ORM internals to clients in production responses.
  // Detailed errors should remain in server logs/observability tooling.
  if (process.env.NODE_ENV !== "production" && error instanceof Error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ error: fallback }, { status: 400 });
}
