"use client";

import { useEffect, useMemo, useState } from "react";

type ApiResource = {
  id: string;
  title: string;
  description: string;
  type: "NOTES" | "STUDY_GUIDE" | "PPT" | "VIDEO" | "REFERENCE";
  url: string | null;
  chapter: { id: string; name: string; subject: { id: string; name: string } };
};

const typeLabel: Record<ApiResource["type"], string> = {
  NOTES: "Notes",
  STUDY_GUIDE: "Study Guide",
  PPT: "PPT",
  VIDEO: "Video",
  REFERENCE: "Reference",
};

function SkeletonCard() {
  return (
    <article className="card skeleton-card" aria-hidden="true">
      <div className="skeleton skeleton-line short" />
      <div className="skeleton skeleton-title" />
      <div className="skeleton skeleton-line" />
      <div className="skeleton skeleton-line medium" />
      <div className="skeleton skeleton-button" />
    </article>
  );
}

export default function Home() {
  const [resources, setResources] = useState<ApiResource[]>([]);
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/resources", { signal: controller.signal, cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load resources.");
        const data = await response.json();
        setResources(Array.isArray(data.resources) ? data.resources : []);
      })
      .catch((reason) => {
        if (reason?.name !== "AbortError") setError("Resources could not be loaded right now.");
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  const subjects = useMemo(
    () => ["All", ...Array.from(new Set(resources.map((resource) => resource.chapter.subject.name)))],
    [resources],
  );

  const filteredResources = useMemo(() => {
    const term = query.trim().toLowerCase();
    return resources.filter((resource) => {
      const subjectName = resource.chapter.subject.name;
      const chapterName = resource.chapter.name;
      return (subject === "All" || subjectName === subject) &&
        (!term || `${resource.title} ${subjectName} ${chapterName} ${resource.description}`.toLowerCase().includes(term));
    });
  }, [query, subject, resources]);

  return (
    <main>
      <header className="header">
        <div className="container nav">
          <a className="brand" href="#top">Student Resource Hub</a>
          <nav aria-label="Primary navigation">
            <a href="#resources">Resources</a>
            <a href="#about">About</a>
          </nav>
        </div>
      </header>

      <section id="top" className="hero container">
        <p className="eyebrow">STUDY RESOURCE LIBRARY</p>
        <h1>Study material, arranged the way you actually look for it.</h1>
        <p className="hero-copy">Start with a subject, pick a chapter, and find the material you need. The aim is simple: less time searching, more time studying.</p>
        <div className="search-wrap">
          <label htmlFor="resource-search" className="sr-only">Search resources</label>
          <input id="resource-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by subject, chapter or topic" />
        </div>
      </section>

      <section id="resources" className="container section" aria-labelledby="resource-heading">
        <div className="section-heading">
          <div><p className="eyebrow">LIBRARY</p><h2 id="resource-heading">Resources</h2></div>
          <span className="count">{loading ? "Loading resources…" : `${filteredResources.length} of ${resources.length}`}</span>
        </div>

        <div className="filters" aria-label="Filter by subject">
          {subjects.map((item) => (
            <button key={item} type="button" className={subject === item ? "filter active" : "filter"} onClick={() => setSubject(item)} aria-pressed={subject === item}>{item}</button>
          ))}
        </div>

        {error ? (
          <div className="empty-state" role="alert"><h3>Resources unavailable</h3><p>{error}</p></div>
        ) : loading ? (
          <div className="grid" aria-label="Loading resources">{Array.from({ length: 6 }, (_, index) => <SkeletonCard key={index} />)}</div>
        ) : (
          <>
            <div className="grid" aria-live="polite">
              {filteredResources.map((resource) => (
                <article className="card" key={resource.id}>
                  <div className="card-meta"><span className="tag">{resource.chapter.subject.name}</span><span>{typeLabel[resource.type]}</span></div>
                  <p className="chapter">{resource.chapter.name}</p>
                  <h3>{resource.title}</h3>
                  <p>{resource.description}</p>
                  <div className="card-footer">
                    <span>{resource.url ? "Resource available" : "Resource details"}</span>
                    {resource.url ? <a href={resource.url} target="_blank" rel="noreferrer" className="filter">Open</a> : <span className="count">No file linked</span>}
                  </div>
                </article>
              ))}
            </div>
            {filteredResources.length === 0 && <div className="empty-state"><h3>No published resources yet</h3><p>Try another search or subject. Published resources added from the admin area will appear here automatically.</p></div>}
          </>
        )}
      </section>

      <section id="about" className="container section about">
        <p className="eyebrow">HOW IT WILL GROW</p>
        <h2>Small, useful features first.</h2>
        <p>The library now reads published resources from the full-stack API. Chapters, files and additional study material can be added through the admin area without changing the student-facing page.</p>
      </section>
    </main>
  );
}
