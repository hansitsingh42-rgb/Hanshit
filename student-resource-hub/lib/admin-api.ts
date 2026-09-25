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
  if (error instanceof Error && error.name === "ValidationError") {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ error: fallback }, { status: 500 });
}
