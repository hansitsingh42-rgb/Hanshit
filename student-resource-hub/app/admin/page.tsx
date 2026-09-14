import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { db } from "@/lib/db";
import ResourceManager from "./resource-manager";

export default async function AdminPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const subjects = await db.subject.findMany({
    orderBy: { name: "asc" },
    include: { chapters: { orderBy: { name: "asc" } } },
  });

  return (
    <main className="container narrow-page">
      <section className="page-header">
        <p className="eyebrow">Admin</p>
        <h1>Resource management</h1>
        <p>Add and manage subjects, chapters and learning resources from one place.</p>
      </section>
      <ResourceManager initialSubjects={subjects} />
    </main>
  );
}
