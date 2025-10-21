# Environment Variables Setup Guide

## Overview

This guide explains how to set up environment variables for the CosPharm Pricing Engine application.

## Files Explained

### `.env.example`
- Template file committed to Git
- Contains example values and structure
- Safe to share publicly

### `.env.local.template`
- Detailed template with actual structure for this project
- Contains the correct variable names and some pre-filled values
- Use this as your starting point

### `.env.local` (You need to create this)
- **NOT committed to Git** (already in `.gitignore`)
- Contains your actual secret values
- This is the file the application will use

## Setup Instructions

### Step 1: Create `.env.local`

Copy the template file to create your local environment file:

```bash
cp .env.local.template .env.local
```

### Step 2: Populate Required Values

Open `.env.local` and update the following placeholders:

#### Required Updates:

1. **JWT_SECRET**
   ```
   JWT_SECRET=your-jwt-secret-change-in-production
   ```
   Generate a strong random string (32+ characters). You can use:
   ```bash
   openssl rand -base64 32
   ```

2. **BUILT_IN_FORGE_API_KEY**
   ```
   BUILT_IN_FORGE_API_KEY=your-forge-api-key
   ```
   Get this from your Forge API dashboard

3. **BUILT_IN_FORGE_API_URL**
   ```
   BUILT_IN_FORGE_API_URL=https://forge-api-url.com
   ```
   Your Forge API endpoint URL

4. **OWNER_NAME**
   ```
   OWNER_NAME=Your Name
   ```
   Your actual name or organization name

5. **OWNER_OPEN_ID**
   ```
   OWNER_OPEN_ID=your-open-id
   ```
   Your OpenID from the OAuth provider

#### Pre-filled Values (Verify/Update if needed):

The following are already filled in the template, but verify they're correct:

- `DATABASE_URL` - PostgreSQL connection string for Render
- `VITE_APP_TITLE` - Application title
- `VITE_APP_LOGO` - Application logo URL
- `VITE_OAUTH_PORTAL_URL` - OAuth portal URL
- `OAUTH_SERVER_URL` - OAuth server URL

## Environment Variables Reference

### Application Configuration

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_APP_ID` | Unique application identifier | `proj_cospharm_pricing_engine` |
| `VITE_APP_TITLE` | Application display title | `"CosPharm Pricing Engine"` |
| `VITE_APP_LOGO` | URL to application logo | `https://placehold.co/40x40/...` |

### Authentication & OAuth

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_OAUTH_PORTAL_URL` | OAuth portal endpoint | Yes |
| `OAUTH_SERVER_URL` | OAuth server endpoint | Yes |
| `JWT_SECRET` | Secret key for JWT signing | Yes |
| `OWNER_NAME` | Owner/admin name | Yes |
| `OWNER_OPEN_ID` | Owner's OpenID | Yes |

### Database Configuration

| Variable | Description | Format |
|----------|-------------|--------|
| `DATABASE_URL` | Primary PostgreSQL connection string | `postgresql://user:pass@host/db` |
| `External_Database_URL` | External database URL (Render) | Same format with external host |
| `Internal_Database_URL` | Internal database URL (Render services) | Same format with internal host |

**Important:** The DATABASE_URL should include `?sslmode=require` for Render PostgreSQL.

### Analytics

| Variable | Description |
|----------|-------------|
| `VITE_ANALYTICS_ENDPOINT` | Analytics service endpoint |
| `VITE_ANALYTICS_WEBSITE_ID` | Website ID for analytics tracking |

### Infrastructure

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment mode | `development` |

## Database Setup

After setting up your `.env.local`, you need to initialize the database:

### Local Development

```bash
# Push schema to database (creates tables)
pnpm db:push

# Seed database with sample data
pnpm seed:populate
```

### Production (Render)

1. Go to your Render dashboard
2. Open your web service
3. Go to "Shell" tab
4. Run the following commands:

```bash
pnpm db:push
pnpm seed:populate
```

## Troubleshooting

### Database Connection Issues

If you see "Error establishing SSL connection":

1. **Verify DATABASE_URL format:**
   ```
   postgresql://user:password@host/database?sslmode=require
   ```

2. **Check database is accessible:**
   - Ensure the database is running
   - Verify credentials are correct
   - Check firewall/network settings

3. **For Render PostgreSQL:**
   - Use External Database URL for local development
   - Use Internal Database URL for Render services
   - SSL is required for external connections

### Environment Variables Not Loading

1. **Restart the development server:**
   ```bash
   pnpm dev
   ```

2. **Verify file name is exactly `.env.local`** (not `.env.local.txt`)

3. **Check file is in project root directory**

## Security Best Practices

1. ✅ **Never commit `.env.local` to Git**
   - Already in `.gitignore`
   - Contains sensitive credentials

2. ✅ **Use strong secrets in production**
   - Generate random JWT_SECRET
   - Use environment-specific values

3. ✅ **Rotate secrets regularly**
   - Update JWT_SECRET periodically
   - Change database passwords

4. ✅ **Use different values per environment**
   - Development vs Production
   - Staging vs Production

## Deployment Checklist

Before deploying to production:

- [ ] All placeholder values replaced with real values
- [ ] JWT_SECRET is a strong random string
- [ ] Database credentials are correct
- [ ] OAuth URLs point to production endpoints
- [ ] Analytics configured for production
- [ ] Database migrations run successfully
- [ ] Sample data seeded (if needed)

## Getting Help

If you encounter issues:

1. Check this guide first
2. Verify all environment variables are set correctly
3. Check application logs for specific error messages
4. Ensure database is accessible from your environment

## Additional Resources

- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Render PostgreSQL Guide](https://render.com/docs/databases)
- [Environment Variables Best Practices](https://12factor.net/config)

