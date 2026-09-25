import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { errorResponse, requireAdminResponse } from "@/lib/admin-api";
import { getAdminSession } from "@/lib/auth";
import { validateResourceInput } from "@/lib/validation";
import { getClientKey, rateLimit } from "@/lib/rate-limit";

export async function GET(request: Request) {
  const limit = rateLimit(getClientKey(request, "resources-read"), 120, 60_000);
  if (!limit.allowed) return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } });
  try {
    const isAdmin = Boolean(await getAdminSession());
    const resources = await db.resource.findMany({
      where: isAdmin ? undefined : { isPublished: true },
      orderBy: { createdAt: "desc" },
      include: { chapter: { include: { subject: true } } },
    });
    return NextResponse.json({ resources });
  } catch {
    return NextResponse.json({ error: "Unable to load resources right now." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const limit = rateLimit(getClientKey(request, "resources-write"), 30, 60_000);
  if (!limit.allowed) return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } });

  const unauthorized = await requireAdminResponse();
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();
    const data = validateResourceInput(body);
    const resource = await db.resource.create({
      data,
      include: { chapter: { include: { subject: true } } },
    });
    return NextResponse.json({ resource }, { status: 201 });
  } catch (error) {
    return errorResponse(error, "Unable to create resource.");
  }
}
