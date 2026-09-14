# Deployment Checklist

## Pre-Deployment Setup

### 1. Create PostgreSQL Database
- Go to [Neon.tech](https://neon.tech) (Free PostgreSQL hosting)
- Create a new project
- Copy the connection string (DATABASE_URL)
- Format: `postgresql://user:password@host:5432/student_resource_hub?schema=public&sslmode=require`

### 2. Generate Secrets
```bash
# Generate AUTH_SECRET
openssl rand -base64 32

# Set strong ADMIN credentials
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=YourStrongPassword123!
```

### 3. Vercel Setup
1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Import Git Repository: `hansitsingh42-rgb/Hanshit`
4. Configure Project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `student-resource-hub`
   - **Build Command**: `npm run build`
   - **Install Command**: `npm install`

### 4. Add Environment Variables to Vercel
In Vercel Dashboard → Project Settings → Environment Variables:

```
DATABASE_URL = postgresql://user:password@host:5432/student_resource_hub?schema=public&sslmode=require
AUTH_SECRET = (your generated secret from step 2)
ADMIN_EMAIL = admin@example.com
ADMIN_PASSWORD = YourStrongPassword123!
```

### 5. Setup GitHub Actions (Optional - for auto-deployment)
In your GitHub repo → Settings → Secrets and variables → Actions:

```
VERCEL_TOKEN = (from https://vercel.com/account/tokens)
VERCEL_ORG_ID = (from Vercel dashboard)
VERCEL_PROJECT_ID = (from Vercel project settings)
```

## Deployment Process

### Option A: Manual Deployment (Recommended First Time)
```bash
cd student-resource-hub
npm install
npm run build
npm run db:deploy
npm run db:seed
npm start
```

### Option B: Automated (via GitHub Actions)
Just push to `project/student-resource-hub` branch and GitHub Actions will:
- Build the project
- Run database migrations
- Deploy to Vercel
- Send notifications

## Post-Deployment

1. ✅ Visit your Vercel deployment URL
2. ✅ Test login with admin credentials
3. ✅ Verify database connection
4. ✅ Create first resources/subjects

## Useful Commands

```bash
# Check database connection
npm run db:deploy

# Seed initial data
npm run db:seed

# Development mode
npm run dev

# Build & test locally
npm run build && npm start
```

## Troubleshooting

- **Database connection fails**: Check DATABASE_URL format and firewall rules
- **Build fails**: Check Node version compatibility (18+)
- **Auth issues**: Verify AUTH_SECRET is set
- **Migrations error**: Run `npx prisma migrate deploy` manually

## Support Links
- [Vercel Docs](https://vercel.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs/)
- [Neon PostgreSQL](https://neon.tech)
