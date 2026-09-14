import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const resources = await db.resource.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
      include: {
        chapter: {
          include: { subject: true },
        },
      },
    });

    return NextResponse.json({ resources });
  } catch {
    return NextResponse.json(
      { error: "Unable to load resources right now." },
      { status: 500 },
    );
  }
}
