import { signIn } from "@/auth";

export default function AdminLoginPage() {
  async function login(formData: FormData) {
    "use server";
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/admin",
    });
  }

  return (
    <main className="container narrow-page">
      <section className="page-header">
        <p className="eyebrow">Admin access</p>
        <h1>Sign in</h1>
        <p>Use the administrator account configured for this project.</p>
      </section>

      <form action={login} className="login-form">
        <label>
          Email
          <input name="email" type="email" autoComplete="username" required />
        </label>
        <label>
          Password
          <input name="password" type="password" autoComplete="current-password" required />
        </label>
        <button type="submit">Sign in</button>
      </form>
    </main>
  );
}
