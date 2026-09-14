import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { errorResponse, requireAdminResponse } from "@/lib/admin-api";
import { validateNameAndSlug } from "@/lib/validation";

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
    return NextResponse.json({ error: "Unable to load subjects right now." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const unauthorized = await requireAdminResponse();
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();
    const { name, slug } = validateNameAndSlug(body);
    const subject = await db.subject.create({ data: { name, slug } });
    return NextResponse.json({ subject }, { status: 201 });
  } catch (error) {
    return errorResponse(error, "Unable to create subject.");
  }
}
