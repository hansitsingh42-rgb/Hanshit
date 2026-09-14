export type Session = {
  role: "admin";
};

/**
 * Authentication boundary placeholder.
 *
 * Admin credentials/session storage must be wired to a real auth provider
 * before any write endpoint is exposed. Keeping this boundary explicit avoids
 * accidentally shipping an insecure password check or client-side admin flag.
 */
export async function getAdminSession(): Promise<Session | null> {
  return null;
}

export async function requireAdmin(): Promise<Session> {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");
  return session;
}
