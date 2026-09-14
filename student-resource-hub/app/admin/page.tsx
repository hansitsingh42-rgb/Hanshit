import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";

export default async function AdminPage() {
  const session = await getAdminSession();

  if (!session) redirect("/admin/login");

  return (
    <main className="container">
      <section className="page-header">
        <p className="eyebrow">Admin</p>
        <h1>Resource management</h1>
        <p>Manage subjects, chapters and published learning resources.</p>
      </section>

      <section className="empty-state" aria-live="polite">
        <h2>Dashboard is being connected</h2>
        <p>
          The protected dashboard shell is ready. Resource CRUD will be enabled
          after a real authentication provider and database connection are configured.
        </p>
      </section>
    </main>
  );
}
