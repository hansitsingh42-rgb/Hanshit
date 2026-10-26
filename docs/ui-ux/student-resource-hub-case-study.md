# Student Resource Hub — UX Case Study

**Status:** Active build; assumptions documented, validation still pending  
**Role:** Student developer / UI implementer

## User

A student who needs to find study material by subject, chapter and resource type without searching through unrelated files or links.

## Problem

Study material becomes difficult to navigate when it is spread across subjects, chapters and different resource formats. The project explores a simple information architecture: **Subject → Chapter → Resource**.

## Research and assumptions

No formal user research has been completed yet. Current design decisions are based on the project goal and student-use assumptions:

- students usually think in terms of subjects and chapters;
- search is useful when the exact location of a resource is unknown;
- resource type is useful for narrowing results;
- the interface should work on both laptop and mobile screens.

These are assumptions, not research findings.

## Design decisions

- Put resource discovery before administration.
- Use subject and chapter filters as primary navigation aids.
- Keep resource type as a secondary filter.
- Show loading, empty and error states instead of leaving the page blank.
- Keep the public experience separate from the admin workflow.
- Support light/dark theme preferences without requiring an account for the public browsing flow.

## Information architecture

```text
Student Resource Hub
├── Resources
│   ├── Subject
│   │   └── Chapter
│   │       └── Resource
│   └── Search / Filters
└── Admin
    ├── Authentication
    ├── Subjects
    ├── Chapters
    └── Resources
```

## User flow

```text
Open Hub → Search or choose Subject → Choose Chapter → Filter Type → Open Resource
```

Admin flow:

```text
Admin Login → Manage Subject/Chapter → Create or edit Resource → Publish → Student view
```

## Wireframes / Figma

A final wireframe set is not being claimed yet. The current repository implementation is the source of truth for the shipped interface until a dedicated Figma design is published.

## What I built

- Next.js application structure
- Subject → Chapter → Resource data model
- Search and filtering UI
- Loading, error and empty states
- Public resource API
- Admin authentication boundary
- Prisma/PostgreSQL data layer
- Theme preference handling
- Security headers and environment-variable configuration

## Accessibility and responsive thinking

The public interface uses semantic headings, labelled controls, buttons for stateful filters, an accessible navigation landmark and responsive layouts. Accessibility still needs real keyboard, screen-reader and mobile testing before full compliance is claimed.

## Security notes

The application uses Auth.js credentials authentication with bcrypt password verification, environment variables for secrets, server-side admin checks and security headers. Rate limiting for authentication/admin endpoints is still an infrastructure-level follow-up and should be added before treating the backend as production-ready.

## What I learned

The project reinforced that information architecture is an engineering concern, not just a visual decision. The data model, API boundaries and UI filters all need to support the same mental model.

## What I would improve

1. Run moderated usability tests with students.
2. Measure search/filter task completion and navigation errors.
3. Improve admin workflows after observing real usage.
4. Add production-grade distributed rate limiting before public backend exposure.
5. Add verified screenshots and a Figma system after the interaction model stabilizes.
