import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { errorResponse, requireAdminResponse } from "@/lib/admin-api";
import { validateNameAndSlug } from "@/lib/validation";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdminResponse();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    const body = await request.json();
    const subjectId = String(body.subjectId || "").trim();
    if (!subjectId) throw new Error("A subject is required.");
    const { name, slug } = validateNameAndSlug(body);
    const chapter = await db.chapter.update({
      where: { id },
      data: { name, slug, subjectId },
      include: { subject: true },
    });
    return NextResponse.json({ chapter });
  } catch (error) {
    return errorResponse(error, "Unable to update chapter.");
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdminResponse();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    await db.chapter.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return errorResponse(error, "Unable to delete chapter.");
  }
}
