export default function AdminLoginPage() {
  return (
    <main className="container narrow-page">
      <section className="page-header">
        <p className="eyebrow">Admin access</p>
        <h1>Sign in</h1>
        <p>Admin authentication will be enabled when the production auth provider is configured.</p>
      </section>

      <section className="empty-state">
        <h2>Authentication not configured</h2>
        <p>
          No password form is exposed yet. This prevents an insecure client-side
          login from being mistaken for real authentication.
        </p>
      </section>
    </main>
  );
}
