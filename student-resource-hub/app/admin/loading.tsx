export default function AdminLoading() {
  return (
    <main className="container" aria-busy="true" aria-label="Loading admin dashboard">
      <section className="page-header">
        <div className="skeleton skeleton-eyebrow" />
        <div className="skeleton skeleton-title" />
        <div className="skeleton skeleton-text" />
      </section>
      <section className="resource-grid">
        {Array.from({ length: 3 }).map((_, index) => (
          <div className="resource-card" key={index}>
            <div className="skeleton skeleton-card-title" />
            <div className="skeleton skeleton-card-text" />
            <div className="skeleton skeleton-card-text short" />
          </div>
        ))}
      </section>
    </main>
  );
}
