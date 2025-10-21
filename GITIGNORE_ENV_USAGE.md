# .env.local and .gitignore Usage Guide

## Current Status

✅ **`.env.local` is already in `.gitignore`**

The `.gitignore` file already includes the following environment file patterns:

```gitignore
# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
```

This means any `.env.local` file you create will **NOT** be committed to Git, keeping your secrets safe.

## How .gitignore Works with .env.local

### What Gets Ignored

When you create `.env.local` in the project root:

```bash
/home/ubuntu/cospharm-pricing-engine/.env.local
```

Git will:
- ✅ Ignore this file completely
- ✅ Not track changes to it
- ✅ Not include it in commits
- ✅ Not push it to GitHub

### What Gets Committed

These files **ARE** committed to Git:

- ✅ `.env.example` - Template with example values
- ✅ `.env.local.template` - Detailed template for this project
- ✅ `.gitignore` - Git ignore rules
- ✅ `ENV_SETUP_GUIDE.md` - Setup instructions

## Verification

You can verify `.env.local` is ignored by running:

```bash
# Create a test .env.local file
echo "TEST=value" > .env.local

# Check git status
git status

# You should NOT see .env.local in the list of untracked files
```

## Creating Your .env.local File

### Method 1: Copy from Template

```bash
cd /home/ubuntu/cospharm-pricing-engine
cp .env.local.template .env.local
```

Then edit `.env.local` with your actual values.

### Method 2: Manual Creation

Create `.env.local` in the project root and add your variables:

```bash
# Application
VITE_APP_ID=proj_cospharm_pricing_engine
VITE_APP_TITLE="CosPharm Pricing Engine"

# Database
DATABASE_URL=postgresql://user:pass@host/database

# Authentication
JWT_SECRET=your-secret-here

# ... etc
```

## Important Notes

### ⚠️ Security

1. **Never rename .env.local to something not in .gitignore**
   - Don't use `.env.prod`, `.env.secrets`, etc.
   - Stick to the standard names that are already ignored

2. **Never commit secrets to Git**
   - Even in comments
   - Even in documentation
   - Use placeholders instead

3. **Rotate secrets if accidentally committed**
   - Change all passwords immediately
   - Update JWT_SECRET
   - Revoke and regenerate API keys

### 📝 Best Practices

1. **Keep .env.local.template updated**
   - When adding new environment variables
   - Document what each variable does
   - Provide example values (not real secrets)

2. **Document required variables**
   - In `ENV_SETUP_GUIDE.md`
   - In code comments where used
   - In deployment documentation

3. **Use environment-specific files**
   - `.env.local` for local development
   - `.env.test.local` for testing
   - Use Render's environment variables for production

## Checking .gitignore Status

### View Current .gitignore

```bash
cat .gitignore | grep -A 5 "Environment variables"
```

### Test if a File is Ignored

```bash
# Check if .env.local would be ignored
git check-ignore -v .env.local

# Output should show:
# .gitignore:12:.env.local    .env.local
```

### List All Ignored Files

```bash
git status --ignored
```

## Production Deployment

For production on Render:

1. **Do NOT use .env.local**
   - Render doesn't have access to your local files

2. **Use Render's Environment Variables**
   - Go to your service dashboard
   - Click "Environment" tab
   - Add each variable individually
   - These are encrypted and secure

3. **Copy values from your .env.local**
   - Use the same variable names
   - Use production values (not development)
   - Update database URLs to production

## Troubleshooting

### "My .env.local is showing in git status"

Check:
1. File name is exactly `.env.local` (not `.env.local.txt`)
2. File is in the project root directory
3. `.gitignore` contains `.env.local`
4. No typos in `.gitignore`

Fix:
```bash
# If accidentally tracked, remove from Git
git rm --cached .env.local

# Verify it's now ignored
git status
```

### "Variables not loading from .env.local"

Check:
1. File is named exactly `.env.local`
2. File is in project root (same level as `package.json`)
3. Variables follow `KEY=value` format (no spaces around `=`)
4. Restart development server after changes

### "Need to share environment setup with team"

Do:
- ✅ Share `.env.local.template`
- ✅ Share `ENV_SETUP_GUIDE.md`
- ✅ Document where to get secret values

Don't:
- ❌ Share actual `.env.local` file
- ❌ Send secrets via email/Slack
- ❌ Commit secrets to Git

Use secure methods:
- Password managers (1Password, LastPass)
- Secure note sharing (Bitwarden Send)
- Encrypted communication

## Summary

| File | Committed to Git | Contains Secrets | Purpose |
|------|------------------|------------------|---------|
| `.env.example` | ✅ Yes | ❌ No | Public template |
| `.env.local.template` | ✅ Yes | ❌ No | Detailed template |
| `.env.local` | ❌ No | ✅ Yes | Your actual secrets |
| `.gitignore` | ✅ Yes | ❌ No | Ignore rules |

**Bottom Line:** `.env.local` is already properly configured to be ignored by Git. Just create it, populate it with your secrets, and you're good to go!

