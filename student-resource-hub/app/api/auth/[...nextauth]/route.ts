import { handlers } from "@/auth";
import { getClientKey, rateLimit } from "@/lib/rate-limit";

export const GET = handlers.GET;

export async function POST(request: Request) {
  const result = rateLimit(getClientKey(request, "auth"), 10, 60_000);
  if (!result.allowed) {
    return new Response(JSON.stringify({ error: "Too many authentication attempts. Please try again later." }), {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(result.retryAfterSeconds),
      },
    });
  }
  return handlers.POST(request);
}
