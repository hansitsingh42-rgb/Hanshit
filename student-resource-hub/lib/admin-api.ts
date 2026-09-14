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
  const message = error instanceof Error ? error.message : fallback;
  return NextResponse.json({ error: message }, { status: 400 });
}
