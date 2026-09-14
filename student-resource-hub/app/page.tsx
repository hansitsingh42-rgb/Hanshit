"use client";

import { useMemo, useState } from "react";

type Resource = {
  title: string;
  subject: string;
  chapter: string;
  type: "Notes" | "Study Guide";
  description: string;
};

const resources: Resource[] = [
  { title: "Computer Networks", subject: "Computer", chapter: "PAN, LAN, MAN & WAN", type: "Notes", description: "Network types explained with simple examples and comparisons." },
  { title: "Functions & Arrays", subject: "Computer", chapter: "C Programming", type: "Notes", description: "A practical starting point for writing and understanding basic C programs." },
  { title: "Laws of Force", subject: "Mechanics", chapter: "Force Systems", type: "Notes", description: "Core ideas, notation and the main laws used in first-year mechanics." },
  { title: "Barriers to Communication", subject: "English", chapter: "Communication Skills", type: "Notes", description: "Short notes for revision, with everyday examples to make the topic clear." },
  { title: "Introduction to AI", subject: "AI", chapter: "AI Fundamentals", type: "Study Guide", description: "Basic AI terminology and concepts before moving to advanced topics." },
  { title: "Chemistry Fundamentals", subject: "Chemistry", chapter: "Engineering Chemistry", type: "Study Guide", description: "Organized first-year material for quick study and revision." },
];

const subjects = ["All", ...Array.from(new Set(resources.map((resource) => resource.subject)))];

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
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState("All");
  const filteredResources = useMemo(() => {
    const term = query.trim().toLowerCase();
    return resources.filter((resource) => {
      const matchesSubject = subject === "All" || resource.subject === subject;
      const matchesSearch = !term || `${resource.title} ${resource.subject} ${resource.chapter} ${resource.description}`.toLowerCase().includes(term);
      return matchesSubject && matchesSearch;
    });
  }, [query, subject]);

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
          <div>
            <p className="eyebrow">LIBRARY</p>
            <h2 id="resource-heading">Resources</h2>
          </div>
          <span className="count">{filteredResources.length} of {resources.length}</span>
        </div>

        <div className="filters" aria-label="Filter by subject">
          {subjects.map((item) => (
            <button key={item} type="button" className={subject === item ? "filter active" : "filter"} onClick={() => setSubject(item)} aria-pressed={subject === item}>
              {item}
            </button>
          ))}
        </div>

        <div className="grid" aria-live="polite">
          {filteredResources.map((resource) => (
            <article className="card" key={`${resource.subject}-${resource.chapter}`}>
              <div className="card-meta">
                <span className="tag">{resource.subject}</span>
                <span>{resource.type}</span>
              </div>
              <p className="chapter">{resource.chapter}</p>
              <h3>{resource.title}</h3>
              <p>{resource.description}</p>
              <div className="card-footer">
                <span>Resource coming next</span>
                <button type="button" disabled>View</button>
              </div>
            </article>
          ))}
        </div>

        {filteredResources.length === 0 && (
          <div className="empty-state">
            <h3>Nothing found</h3>
            <p>Try another word or switch to a different subject.</p>
          </div>
        )}
      </section>

      <section id="about" className="container section about">
        <p className="eyebrow">HOW IT WILL GROW</p>
        <h2>Small, useful features first.</h2>
        <p>The first version keeps the interface straightforward. The next layers will add real chapters and files, a database, accounts, an admin area and secure APIs without turning the site into a complicated dashboard.</p>
      </section>
    </main>
  );
}
