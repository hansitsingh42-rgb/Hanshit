# Student Resource Hub

A full-stack student resource library for organizing learning material by **Subject → Chapter → Resource**. The project is developed independently on the `project/student-resource-hub` branch so the existing `main` project remains unchanged.

## Current foundation

- Next.js App Router foundation
- Responsive professional UI
- Subject and chapter based resource structure
- Resource cards with search and subject filtering
- Accessible search field foundation
- Skeleton loading screens with shimmer effect
- Reduced-motion support
- Clear loading, empty and error-state foundation
- PostgreSQL + Prisma data model
- Secure server-side validation
- Admin authentication and role-based authorization
- Admin dashboard for managing subjects, chapters and resources
- Resource publish/unpublish controls
- Protected API routes for admin operations
- Database health-check endpoint
- Initial Prisma production migration

## Core structure

```text
Subject
  └── Chapter
       └── Resource
            ├── Notes
            ├── Study Guide
            ├── PPT
            ├── Video
            └── Reference
```

## Main features

### Student side

- Browse learning resources by subject and chapter
- Search resources by title and description
- Filter resources by subject
- Responsive resource cards
- Clear empty and loading states
- Resource links ready for future PDF, video and other material

### Admin side

- Secure credentials-based admin login
- Role-based access control
- Create and edit subjects
- Create and edit chapters
- Create and edit resources
- Publish or unpublish resources
- Delete resources, chapters and subjects
- Server-side input validation

## Technology

- **Framework:** Next.js App Router
- **Language:** TypeScript
- **UI:** React + CSS
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** Auth.js credentials provider
- **Password hashing:** bcryptjs
- **Deployment target:** Vercel

## Project structure

```text
student-resource-hub/
├── app/
│   ├── admin/
│   │   ├── login/
│   │   ├── loading.tsx
│   │   ├── page.tsx
│   │   └── resource-manager.tsx
│   ├── api/
│   │   ├── auth/[...nextauth]/
│   │   ├── chapters/
│   │   ├── health/
│   │   ├── resources/
│   │   └── subjects/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   ├── auth.ts
│   ├── db.ts
│   └── validation.ts
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.mjs
├── types/
│   └── next-auth.d.ts
├── .env.example
├── next.config.ts
├── package.json
└── README.md
```

## Environment variables

Create a local `.env` file from `.env.example` and provide real values locally or in the deployment platform. **Do not commit secrets to GitHub.**

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/student_resource_hub?schema=public"
AUTH_SECRET="replace-with-a-long-random-secret"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="replace-with-a-long-password"
```

## Local development

From the `student-resource-hub` directory:

```bash
npm install
npm run dev
```

The application runs on the local Next.js development server.

## Database setup

After configuring `DATABASE_URL`:

```bash
npm run db:deploy
npm run db:seed
```

`db:deploy` applies the committed Prisma migrations. `db:seed` creates the admin account using the values supplied through environment variables.

## Security notes

- Authentication is handled server-side.
- Admin APIs require an authenticated admin session.
- Passwords are stored as bcrypt hashes rather than plain text.
- Resource, subject and chapter input is validated before database writes.
- Resource URLs are restricted to HTTP/HTTPS.
- Secrets are kept in environment variables and are not committed to the repository.
- Public resource reads expose published resources only; admin reads are protected.

## Development status

### Completed

- [x] Next.js project foundation
- [x] Responsive resource-library UI
- [x] Search and subject filtering foundation
- [x] Skeleton loading UI
- [x] Subject → Chapter → Resource database model
- [x] Prisma migration
- [x] Authentication foundation
- [x] Admin dashboard
- [x] Subject, chapter and resource CRUD APIs
- [x] Admin resource management UI
- [x] Server-side validation
- [x] Health-check API

### Next

- [ ] Connect a production PostgreSQL database
- [ ] Add real study PDFs, notes, PPTs and videos
- [ ] Improve resource preview experience
- [ ] Add stronger automated test coverage
- [ ] Run full production build and security verification
- [ ] Deploy the project to Vercel
- [ ] Add production screenshots and final documentation

## Development principle

Existing `main` content is not modified by this project. Changes are developed independently first and should only be merged deliberately after testing.

## License

This project is currently maintained as a personal learning and portfolio project. Licensing can be added when the project is ready for public reuse.
