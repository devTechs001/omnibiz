# GitHub Pages Deployment Guide

## Setup

1. **Update the homepage URL** in `package.json`:
   ```json
   "homepage": "https://YOURUSERNAME.github.io/omnibiz"
   ```
   Replace `YOURUSERNAME` with your GitHub username.

2. **Enable GitHub Pages** in your repository settings:
   - Go to Settings → Pages
   - Source: GitHub Actions (recommended)
   - Or use the `gh-pages` branch

## Deployment Methods

### Method 1: GitHub Actions (Automatic)

The workflow `.github/workflows/gh-pages.yml` will automatically deploy when you push to `main`:

```bash
git push origin main
```

### Method 2: Manual Deploy

```bash
# Install cross-env if not already installed
npm install --save-dev cross-env

# Deploy
npm run deploy
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run build:gh-pages` | Build for GitHub Pages with correct base path |
| `npm run deploy` | Deploy to gh-pages branch |

## Configuration

### Vite Config

The `base` path is automatically set when building:
- Development: `/`
- GitHub Pages: `/omnibiz/`

### PWA Considerations

The PWA manifest scope is set to `/`. For GitHub Pages, the actual scope will be `/omnibiz/`. Update the PWA manifest in `vite.config.js` if needed:

```js
manifest: {
  scope: '/omnibiz/',
  start_url: '/omnibiz/',
}
```

## Troubleshooting

### 404 Errors
- Ensure `homepage` URL is correct in `package.json`
- Check that the build includes the correct base path

### PWA Not Working
- Update manifest scope and start_url for subdirectory deployment
- Clear browser cache and re-register service worker
