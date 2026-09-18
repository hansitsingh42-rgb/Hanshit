# Vercel Deployment Setup Guide

This guide describes the manual setup required to deploy the Student Resource Hub. The repository does not contain a Vercel deployment workflow, so GitHub pushes alone do not deploy this project unless Vercel Git integration has been configured for the repository.

## Quick Start

### Step 1: Create a PostgreSQL Database

You can use a PostgreSQL provider such as Neon, Railway, or Supabase.

After creating the database, copy its connection string for the `DATABASE_URL` environment variable. Keep database credentials private.

### Step 2: Generate AUTH_SECRET

Generate a long random secret in a secure environment:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Or:

```bash
openssl rand -hex 32
```

Do not commit the generated secret to GitHub.

### Step 3: Configure Vercel

If you choose to deploy with Vercel:

1. Open the Vercel dashboard.
2. Create or select a project connected to this repository.
3. Set **Root Directory** to `student-resource-hub`.
4. Use the Next.js framework settings.
5. Configure the required environment variables.

Required environment variables:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Your PostgreSQL connection string |
| `AUTH_SECRET` | A long random secret |
| `ADMIN_EMAIL` | The administrator email |
| `ADMIN_PASSWORD` | A strong password of at least 12 characters |

`NEXTAUTH_URL` is not required by the repository's current Auth.js configuration. Only configure it if your chosen Auth.js deployment setup specifically requires it.

### Step 4: Deploy

The repository does not currently define an automated Vercel deployment workflow. After connecting the repository to Vercel and configuring the project, use Vercel's deployment controls to create a deployment.

If Vercel Git integration is enabled, Vercel can create deployments from the configured repository and branch according to the project's Vercel settings. Those settings are external to this repository.

## Post-Deployment

### Initialize the Database

The repository contains a Prisma migration and a seed script. The standard Vercel build command does not automatically apply the migration or seed the admin account.

From a secure administration environment, after configuring the database and environment variables:

```bash
npm run db:deploy
npm run db:seed
```

### Verify the Application

Check that:

- The homepage loads.
- Published resources appear.
- Subject, chapter, type, and search filters work.
- Light/Dark Mode works.
- Admin login works.
- Authorized admin resource management works.
- No unexpected browser console errors are present.

## Troubleshooting

### Build failed

- Check the deployment build logs.
- Confirm the Vercel project root is `student-resource-hub`.
- Confirm all required environment variables are configured.
- Check that dependencies install successfully.

### Database connection error

- Verify `DATABASE_URL`.
- Confirm the database is reachable from the deployment environment.
- Check the deployment logs for the failing operation.

### AUTH_SECRET not set

Configure `AUTH_SECRET` in the deployment environment and redeploy.

### Migrations pending

Apply the committed migration from a secure administration environment:

```bash
npm run db:deploy
```

Do not expose database credentials in logs, commits, screenshots, or issue reports.

## Production Checklist

- [ ] `DATABASE_URL` configured
- [ ] `AUTH_SECRET` configured
- [ ] Admin email configured
- [ ] Strong admin password configured
- [ ] Database migration applied
- [ ] Admin account seeded
- [ ] Admin login verified
- [ ] Published resources verified
- [ ] Search and filters verified
- [ ] Light/Dark Mode verified
- [ ] Browser console checked
- [ ] Deployment logs checked

## Support Documentation

Use the official documentation for the deployment platform, Next.js, and Prisma when troubleshooting platform-specific issues.
