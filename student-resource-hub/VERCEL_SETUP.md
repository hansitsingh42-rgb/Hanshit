# Vercel Deployment Setup Guide

## Quick Start (5 minutes)

### Step 1: Create Free PostgreSQL Database

**Option A: Neon.tech (Recommended)**
1. Go to https://neon.tech
2. Sign up with GitHub
3. Create new project: `student-resource-hub`
4. Copy connection string
5. Append to URL: `?sslmode=require`

**Option B: Railway.app**
1. Go to https://railway.app
2. Create new project
3. Add PostgreSQL service
4. Copy DATABASE_URL

**Option C: Supabase**
1. Go to https://supabase.com
2. Create new project
3. Go to Settings → Database → Connection string
4. Copy PostgreSQL URL

---

### Step 2: Generate AUTH_SECRET

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Or use OpenSSL:
```bash
openssl rand -hex 32
```

---

### Step 3: Deploy to Vercel

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard

2. **Click "Add New" → "Project"**

3. **Import Repository**
   - Select: `hansitsingh42-rgb/Hanshit`
   - Click "Import"

4. **Configure Project**
   - **Framework**: Next.js ✓
   - **Root Directory**: `student-resource-hub` ✓
   - **Build Command**: `npm run build` ✓
   - **Environment Variables**: See below

5. **Add Environment Variables**
   
   Click "Add Environment Variables" and enter:
   
   | Variable | Value |
   |----------|-------|
   | `DATABASE_URL` | `postgresql://...` (from Step 1) |
   | `AUTH_SECRET` | (from Step 2) |
   | `ADMIN_EMAIL` | `admin@example.com` |
   | `ADMIN_PASSWORD` | `YourStrongPassword123!` |
   | `NEXTAUTH_URL` | `https://student-resource-hub.vercel.app` |

6. **Deploy!**
   - Click "Deploy"
   - Wait 2-3 minutes
   - ✅ Done!

---

## Post-Deployment

### Access Your App
```
https://student-resource-hub.vercel.app
```

### Login
```
Email: admin@example.com
Password: (from ADMIN_PASSWORD)
```

### Initialize Database

The database will be initialized automatically on first deploy. If not:

```bash
# Run migrations
Vercel Dashboard → Functions → Logs

# Or manually via terminal
npx prisma migrate deploy
npx prisma db seed
```

---

## Troubleshooting

### "Build failed"
- Check Node.js version: 18+ required
- Check package.json for syntax errors
- Check all dependencies are installed

### "Database connection error"
- Verify DATABASE_URL is correct
- Check firewall allows Vercel IPs
- Test connection locally: `psql $DATABASE_URL`

### "AUTH_SECRET not set"
- Go to Vercel Dashboard
- Project → Settings → Environment Variables
- Add AUTH_SECRET

### "Migrations pending"
- Migrations run automatically on deploy
- Check Vercel build logs for errors
- Run manually: `npx prisma migrate deploy`

---

## Update Deployments

Deployments happen automatically when you push to `project/student-resource-hub`:

```bash
git push origin project/student-resource-hub
```

Vercel will:
1. Detect the push
2. Build your project
3. Run tests & migrations
4. Deploy to production
5. Send notification

---

## Production Checklist

- [ ] DATABASE_URL set in Vercel
- [ ] AUTH_SECRET generated & set
- [ ] Admin credentials configured
- [ ] NEXTAUTH_URL matches deployment
- [ ] Database migrations passed
- [ ] Login works with admin account
- [ ] Can view/create resources
- [ ] No console errors
- [ ] Performance acceptable

---

## Support

- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- Prisma Docs: https://prisma.io/docs
- Database Support: See Neon/Railway/Supabase docs

---

**🎉 Deployment complete!**
