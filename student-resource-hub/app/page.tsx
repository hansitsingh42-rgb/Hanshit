"use client";

import { useEffect, useMemo, useState } from "react";
import ThemeToggle from "./components/ThemeToggle";

type ResourceType = "NOTES" | "STUDY_GUIDE" | "PPT" | "VIDEO" | "REFERENCE";

type ApiResource = {
  id: string;
  title: string;
  description: string;
  type: ResourceType;
  url: string | null;
  chapter: { id: string; name: string; subject: { id: string; name: string } };
};

const typeLabel: Record<ResourceType, string> = {
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
  const [chapter, setChapter] = useState("All");
  const [type, setType] = useState<"All" | ResourceType>("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/resources", { signal: controller.signal, cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load resources.");
        const data = await response.json();
        setResources(Array.isArray(data.resources) ? data.resources : []);
        setError("");
      })
      .catch((reason) => {
        if (reason?.name !== "AbortError") {
          setError("Resources could not be loaded right now.");
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  const subjects = useMemo(
    () => ["All", ...Array.from(new Set(resources.map((resource) => resource.chapter.subject.name))).sort()],
    [resources],
  );

  const chapters = useMemo(() => {
    const scoped = subject === "All"
      ? resources
      : resources.filter((resource) => resource.chapter.subject.name === subject);

    return [
      "All",
      ...Array.from(new Map(scoped.map((resource) => [resource.chapter.id, resource.chapter.name])).values()).sort(),
    ];
  }, [resources, subject]);

  const filteredResources = useMemo(() => {
    const term = query.trim().toLowerCase();

    return resources.filter((resource) => {
      const subjectName = resource.chapter.subject.name;
      const chapterName = resource.chapter.name;
      const matchesSubject = subject === "All" || subjectName === subject;
      const matchesChapter = chapter === "All" || chapterName === chapter;
      const matchesType = type === "All" || resource.type === type;
      const searchable = `${resource.title} ${subjectName} ${chapterName} ${resource.description}`.toLowerCase();
      return matchesSubject && matchesChapter && matchesType && (!term || searchable.includes(term));
    });
  }, [query, subject, chapter, type, resources]);

  function clearFilters() {
    setQuery("");
    setSubject("All");
    setChapter("All");
    setType("All");
  }

  const hasFilters = query.trim() !== "" || subject !== "All" || chapter !== "All" || type !== "All";

  return (
    <main>
      <header className="header">
        <div className="container nav">
          <a className="brand" href="#top">Student Resource Hub</a>
          <div className="nav-actions">
            <nav aria-label="Primary navigation">
              <a href="#resources">Resources</a>
              <a href="#about">About</a>
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <section id="top" className="hero container">
        <p className="eyebrow">STUDY RESOURCE LIBRARY</p>
        <h1>Find the right study material without the search headache.</h1>
        <p className="hero-copy">
          Choose a subject or chapter, filter by resource type, or search by topic. Open the material directly when you find it.
        </p>
        <div className="search-wrap">
          <label htmlFor="resource-search" className="sr-only">Search resources</label>
          <input
            id="resource-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search subject, chapter, topic or resource"
            autoComplete="off"
          />
        </div>
      </section>

      <section id="resources" className="container section" aria-labelledby="resource-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">LIBRARY</p>
            <h2 id="resource-heading">Resources</h2>
          </div>
          <span className="count">
            {loading ? "Loading resources…" : `${filteredResources.length} of ${resources.length}`}
          </span>
        </div>

        <div className="filters" aria-label="Resource filters">
          {subjects.map((item) => (
            <button
              key={item}
              type="button"
              className={subject === item ? "filter active" : "filter"}
              onClick={() => {
                setSubject(item);
                setChapter("All");
              }}
              aria-pressed={subject === item}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="library-controls">
          <label>
            Chapter
            <select value={chapter} onChange={(event) => setChapter(event.target.value)}>
              {chapters.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>

          <label>
            Type
            <select value={type} onChange={(event) => setType(event.target.value as "All" | ResourceType)}>
              <option value="All">All types</option>
              {Object.entries(typeLabel).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>

          {hasFilters && (
            <button type="button" className="filter clear-filter" onClick={clearFilters}>
              Clear filters
            </button>
          )}
        </div>

        {error ? (
          <div className="empty-state" role="alert">
            <h3>Resources unavailable</h3>
            <p>{error}</p>
          </div>
        ) : loading ? (
          <div className="grid" aria-label="Loading resources">
            {Array.from({ length: 6 }, (_, index) => <SkeletonCard key={index} />)}
          </div>
        ) : filteredResources.length === 0 ? (
          <div className="empty-state">
            <h3>{resources.length === 0 ? "No published resources yet" : "No matching resources"}</h3>
            <p>
              {resources.length === 0
                ? "Published resources added from the admin area will appear here automatically."
                : "Try a different search or filter, or clear the current filters."}
            </p>
            {resources.length > 0 && hasFilters && (
              <button type="button" className="filter" onClick={clearFilters}>Show all resources</button>
            )}
          </div>
        ) : (
          <div className="grid" aria-live="polite">
            {filteredResources.map((resource) => (
              <article className="card" key={resource.id}>
                <div className="card-meta">
                  <span className="tag">{resource.chapter.subject.name}</span>
                  <span>{typeLabel[resource.type]}</span>
                </div>
                <p className="chapter">{resource.chapter.name}</p>
                <h3>{resource.title}</h3>
                <p>{resource.description}</p>
                <div className="card-footer">
                  <span>{resource.url ? "Ready to study" : "Details only"}</span>
                  {resource.url ? (
                    <a href={resource.url} target="_blank" rel="noopener noreferrer" className="filter">
                      Open resource
                    </a>
                  ) : (
                    <span className="count">No link</span>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section id="about" className="container section about">
        <p className="eyebrow">THE IDEA</p>
        <h2>One simple place for study material.</h2>
        <p>
          Subjects, chapters and published resources are managed from the admin area. Students only need to search, filter and open what they need.
        </p>
      </section>
    </main>
  );
}
