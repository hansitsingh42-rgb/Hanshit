import { auth } from "@/auth";

export async function getAdminSession() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return null;
  return session;
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");
  return session;
}
