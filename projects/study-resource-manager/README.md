# Study Resource Manager

A clean, responsive personal study library for organizing useful learning resources by subject and type.

## Features

- Add custom study resources
- Subject and resource-type filters
- Instant search
- Favorites filter
- Delete resources
- Starter resources included
- Dark/light theme with persistence
- LocalStorage persistence
- Responsive desktop and mobile layout
- Safe external-link handling

## Resource types

PDF • Video • Link • Notes

## Tech Stack

HTML • CSS • JavaScript • LocalStorage

## Run locally

Open `index.html` in a browser. No build tools or dependencies are required.

## Project goal

Practice DOM manipulation, browser storage, filtering, search, responsive UI design and practical student-focused application development.

## Limitations

Resources are stored locally in the browser. This version does not upload files to a server or provide multi-user accounts.

## Engineering Evidence

**Architecture:** Browser UI → DOM event handlers → LocalStorage state → rendered resource cards.

**Validation:** The repository-level CI checks JavaScript syntax and HTML parsing for tracked project files.

**Security:** No server credentials are required. External links should remain explicitly handled by the project UI, and browser-only data stays in LocalStorage.

**Live preview:** `/study-resource-manager/` when published through the repository's GitHub Pages deployment.

## Verification Checklist

- Responsive UI
- Search/filter interactions
- Favorites and deletion flows
- Theme persistence
- LocalStorage persistence
- JavaScript syntax validation
