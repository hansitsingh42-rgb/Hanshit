# Student Resource Hub

A modern, responsive academic resource discovery website built for students to browse study material through a simple **Subject → Chapter → Resource** flow.

## Overview

Student Resource Hub focuses on organized academic discovery rather than course selling. The static GitHub Pages version demonstrates the complete student-facing interface, interactions and visual experience, while the separate full-stack version provides the backend architecture for real data and authentication.

## Key Features

- Subject and chapter based resource discovery
- Search and subject filtering
- Resource detail pages
- Preview interface
- Save-for-later bookmarks
- Recently viewed resources
- Local study-progress state
- Responsive multi-page navigation
- Dark/light theme with persistence
- Ctrl/Cmd + K instant search
- Premium glassmorphism UI
- Animated aurora and perspective grid background
- Lightweight Canvas particle animation
- Interactive 3D-style hero motion
- Hover and micro-interaction effects
- Reduced-motion accessibility support
- Client-side authentication and contact validation
- GitHub Pages deployment workflow

## Tech Stack

**Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6+)

**Visuals:** CSS gradients, glassmorphism, HTML5 Canvas, CSS 3D perspective/transforms

**State:** Browser LocalStorage

**Deployment:** GitHub Pages + GitHub Actions

## Project Structure

```text
student-resource-hub/
├── index.html
├── resources.html
├── search.html
├── resource.html
├── features.html
├── about.html
├── auth.html
├── contact.html
├── style.css
├── fixes.css
├── script.js
├── PROJECT.md
└── README.md
```

## Static vs Full-Stack

The GitHub Pages version is intentionally a static portfolio/demo experience. It does **not** claim real server-side authentication, OAuth, database persistence, file hosting or server-side contact submission.

The separate full-stack Student Resource Hub is designed for those backend capabilities using a modern application architecture.

## Live Preview

Published through the repository's GitHub Pages workflow.

## Purpose

This project demonstrates practical frontend development, responsive UI/UX, browser-side state management, interaction design, accessibility awareness and deployment workflow knowledge.
