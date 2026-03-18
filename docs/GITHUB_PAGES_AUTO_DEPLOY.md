# GitHub Pages Auto-Deploy

## Automatic Deployment

The application is now configured to **automatically deploy to GitHub Pages** whenever you push changes to the `main` branch.

## How It Works

1. **Push to main**: When you push code changes to the `main` branch
2. **GitHub Actions triggers**: The workflow in `.github/workflows/deploy-gh-pages.yml` automatically:
   - Builds the client application with `GITHUB_PAGES=true` (sets correct base path `/omnibiz/`)
   - Deploys the build output to the `gh-pages` branch
3. **GitHub Pages updates**: Your site at `https://devtechs001.github.io/omnibiz/` is updated within 1-2 minutes

## Manual Deployment

If you need to manually trigger a deployment:

1. Go to your repository on GitHub
2. Click **Actions** → **Deploy to GitHub Pages**
3. Click **Run workflow** → **Run workflow**

## GitHub Pages Configuration

Make sure your GitHub Pages settings are:
- **Source**: Deploy from a branch
- **Branch**: `gh-pages`
- **Folder**: `/ (root)`

Access your site at: **https://devtechs001.github.io/omnibiz/**

## Important Notes

- The `gh-pages` branch contains **built files only** (not source code)
- Never merge `gh-pages` into `main` - they serve different purposes
- Always build with `GITHUB_PAGES=true` to get the correct base path `/omnibiz/`
- Deployment takes ~1-2 minutes after push

## Workflow File

The auto-deploy workflow is configured in:
`.github/workflows/deploy-gh-pages.yml`
