"use client";

import { useEffect, useState } from "react";

type Resource = {
  title: string;
  subject: string;
  type: string;
  description: string;
};

const resources: Resource[] = [
  { title: "Computer Networks — PAN, LAN, MAN & WAN", subject: "Computer", type: "Notes", description: "Clear fundamentals for network types and their use cases." },
  { title: "C Programming — Functions & Arrays", subject: "Programming", type: "Notes", description: "Beginner-friendly revision material for core C concepts." },
  { title: "Engineering Mechanics — Laws of Force", subject: "Mechanics", type: "Notes", description: "Key concepts, formulas and force-system fundamentals." },
  { title: "Communication Skills — Barriers", subject: "English", type: "Notes", description: "Short revision notes with practical examples." },
  { title: "Artificial Intelligence — Introduction", subject: "AI", type: "Study Guide", description: "An introductory guide to AI concepts and terminology." },
  { title: "Engineering Chemistry — Fundamentals", subject: "Chemistry", type: "Study Guide", description: "Structured material for first-year revision." },
];

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 900);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <main>
      <header className="header">
        <div className="container nav">
          <div className="brand">Student Resource Hub</div>
          <nav aria-label="Primary navigation">
            <a href="#resources">Resources</a>
            <a href="#about">About</a>
          </nav>
        </div>
      </header>

      <section className="hero container">
        <p className="eyebrow">STUDY RESOURCE LIBRARY</p>
        <h1>Find the right resource for what you are learning.</h1>
        <p className="hero-copy">Organized study material for subjects, chapters and revision — designed to stay simple and useful.</p>
        <div className="search-wrap">
          <label htmlFor="resource-search" className="sr-only">Search resources</label>
          <input id="resource-search" placeholder="Search resources..." aria-label="Search resources" />
        </div>
      </section>

      <section id="resources" className="container section" aria-labelledby="resource-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">LIBRARY</p>
            <h2 id="resource-heading">Resources</h2>
          </div>
          <span className="count">{loading ? "Loading" : `${resources.length} resources`}</span>
        </div>

        <div className="grid" aria-live="polite">
          {loading ? resources.map((_, index) => <SkeletonCard key={index} />) : resources.map((resource) => (
            <article className="card" key={resource.title}>
              <span className="tag">{resource.subject}</span>
              <h3>{resource.title}</h3>
              <p>{resource.description}</p>
              <div className="card-footer">
                <span>{resource.type}</span>
                <button type="button">View resource</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="about" className="container section about">
        <p className="eyebrow">FOUNDATION</p>
        <h2>Built for focused learning.</h2>
        <p>Next phases will add subject → chapter navigation, database-backed resources, authentication, an admin dashboard, secure APIs, search and filters, analytics, and production testing.</p>
      </section>
    </main>
  );
}
