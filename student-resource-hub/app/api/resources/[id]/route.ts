import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { errorResponse, requireAdminResponse } from "@/lib/admin-api";
import { validateResourceInput } from "@/lib/validation";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdminResponse();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    const body = await request.json();
    const data = validateResourceInput(body);
    const resource = await db.resource.update({
      where: { id },
      data,
      include: { chapter: { include: { subject: true } } },
    });
    return NextResponse.json({ resource });
  } catch (error) {
    return errorResponse(error, "Unable to update resource.");
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdminResponse();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    await db.resource.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return errorResponse(error, "Unable to delete resource.");
  }
}
