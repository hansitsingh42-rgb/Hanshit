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
    const { name, slug } = validateNameAndSlug(body);
    const subject = await db.subject.update({ where: { id }, data: { name, slug } });
    return NextResponse.json({ subject });
  } catch (error) {
    return errorResponse(error, "Unable to update subject.");
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdminResponse();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    await db.subject.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return errorResponse(error, "Unable to delete subject.");
  }
}
