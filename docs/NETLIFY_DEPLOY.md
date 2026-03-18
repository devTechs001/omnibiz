# Netlify Deployment Guide

## Quick Start

### Method 1: Netlify UI (Recommended)

1. **Connect to GitHub**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository
   - Select the `omnibiz` repository

2. **Build Settings**
   - **Base directory**: (leave empty)
   - **Build command**: `cd client && npm install && npm run build`
   - **Publish directory**: `client/dist`

3. **Environment Variables**
   ```
   NODE_VERSION=22
   VITE_API_URL=https://omnibiz.onrender.com
   VITE_SOCKET_URL=https://omnibiz.onrender.com
   ```

4. **Deploy**
   - Click "Deploy site"
   - Netlify will automatically deploy on every push to `main`

### Method 2: GitHub Actions

1. **Get Netlify credentials**
   - Go to Netlify → User Settings → Applications → Authorized OAuth applications
   - Generate a new personal access token

2. **Add secrets to GitHub**
   - Go to your repository → Settings → Secrets and variables → Actions
   - Add repository secrets:
     - `NETLIFY_AUTH_TOKEN`: Your Netlify auth token
     - `NETLIFY_SITE_ID`: Your site ID (found in Site Settings → General → Site details)

3. **Push to main**
   ```bash
   git push origin main
   ```

## Configuration Files

### `client/netlify.toml`

```toml
[build]
  command = "cd client && npm install && npm run build"
  publish = "client/dist"

[build.environment]
  NODE_VERSION = "22"
  VITE_API_URL = "https://omnibiz.onrender.com"
  VITE_SOCKET_URL = "https://omnibiz.onrender.com"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## Features

- ✅ **Automatic HTTPS**
- ✅ **CDN caching**
- ✅ **Instant rollbacks**
- ✅ **Preview deployments** (for PRs)
- ✅ **Custom headers** for security
- ✅ **SPA routing** support

## Commands

| Command | Description |
|---------|-------------|
| `netlify deploy` | Manual deploy via CLI |
| `netlify deploy --prod` | Production deploy via CLI |

## Install Netlify CLI (Optional)

```bash
npm install -g netlify-cli
netlify login
netlify link
netlify deploy --prod
```

## Troubleshooting

### Build Fails
- Check Node version (should be 22)
- Verify all dependencies are installed
- Review build logs in Netlify dashboard

### API Connection Issues
- Update `VITE_API_URL` in Netlify environment variables
- Ensure backend is running and accessible

### 404 on Refresh
- The `[[redirects]]` in `netlify.toml` handles SPA routing
- Make sure the config file is in the `client/` directory
