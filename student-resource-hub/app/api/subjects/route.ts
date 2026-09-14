import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const subjects = await db.subject.findMany({
      orderBy: { name: "asc" },
      include: {
        chapters: {
          orderBy: { name: "asc" },
          select: { id: true, name: true, slug: true },
        },
      },
    });

    return NextResponse.json({ subjects });
  } catch {
    return NextResponse.json(
      { error: "Unable to load subjects right now." },
      { status: 500 },
    );
  }
}
