import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { errorResponse, requireAdminResponse } from "@/lib/admin-api";
import { validateNameAndSlug } from "@/lib/validation";

export async function POST(request: Request) {
  const unauthorized = await requireAdminResponse();
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();
    const subjectId = String(body.subjectId || "").trim();
    if (!subjectId) throw new Error("A subject is required.");
    const { name, slug } = validateNameAndSlug(body);

    const chapter = await db.chapter.create({
      data: { name, slug, subjectId },
      include: { subject: true },
    });
    return NextResponse.json({ chapter }, { status: 201 });
  } catch (error) {
    return errorResponse(error, "Unable to create chapter.");
  }
}
