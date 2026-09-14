import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    await db.$queryRaw`SELECT 1`;
    return NextResponse.json({ status: "ok", database: "ok" });
  } catch {
    return NextResponse.json(
      { status: "error", database: "unavailable" },
      { status: 503 },
    );
  }
}
