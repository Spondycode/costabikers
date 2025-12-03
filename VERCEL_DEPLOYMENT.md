# Vercel Deployment Guide

## Quick Deploy

1. **Push your code to GitHub** (if not already done)

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your repository
   - Vercel will auto-detect Vite configuration

3. **Add Environment Variables**
   Go to your project settings → Environment Variables and add:
   
   - `GEMINI_API_KEY` - Your Google AI Studio API key
   - `IMGBB_API_KEY` - Your ImgBB API key (for image uploads)
   
   **IMPORTANT**: The app will show a blank screen if these are missing!

4. **Deploy**
   - Vercel will automatically build and deploy
   - The build command is: `npm run build`
   - The output directory is: `dist`

## Troubleshooting Blank Screen

If you see a blank screen after deployment:

### 1. Check Environment Variables
```bash
# In Vercel Dashboard:
Settings → Environment Variables
```
Make sure both `GEMINI_API_KEY` and `IMGBB_API_KEY` are set for all environments (Production, Preview, Development).

### 2. Check Build Logs
```bash
# In Vercel Dashboard:
Deployments → [Your deployment] → Build Logs
```
Look for any errors during the build process.

### 3. Check Browser Console
Open your deployed app and press F12 to open Developer Tools. Check for:
- JavaScript errors in the Console tab
- Failed network requests in the Network tab
- Look for 404 errors on assets

### 4. Verify vercel.json
The `vercel.json` file should exist with SPA routing configured:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

### 5. Check .gitignore
Make sure `dist/` is in `.gitignore` (it should be) so you're not committing build artifacts.

### 6. Redeploy
After setting environment variables, trigger a new deployment:
```bash
# In Vercel Dashboard:
Deployments → [...] → Redeploy
```

## Common Issues

### Issue: "Cannot find module" errors
**Solution**: Make sure all dependencies are in `package.json`, not just `devDependencies`

### Issue: Environment variables not working
**Solution**: 
- Environment variables must be set in Vercel Dashboard (not just .env.local)
- After adding/changing env vars, redeploy the project
- Variable names must match exactly: `GEMINI_API_KEY` and `IMGBB_API_KEY`

### Issue: 404 on page refresh
**Solution**: The `vercel.json` rewrites configuration handles this. Make sure it's committed.

## Manual Deployment (Alternative)

If you have Vercel CLI installed:

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Set environment variables
vercel env add GEMINI_API_KEY
vercel env add IMGBB_API_KEY

# Deploy to production
vercel --prod
```

## Post-Deployment Checklist

- [ ] App loads without blank screen
- [ ] Login works
- [ ] Can navigate between tabs
- [ ] AI features work (route briefing, chat)
- [ ] Image upload works (if using)
- [ ] Mobile navigation works
- [ ] All data persists in localStorage

## Getting Your API Keys

### Gemini API Key
1. Go to https://aistudio.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and add it to Vercel environment variables

### ImgBB API Key
1. Go to https://api.imgbb.com/
2. Sign up for a free account
3. Get your API key from the dashboard
4. Copy the key and add it to Vercel environment variables
