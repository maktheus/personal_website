# Deployment Guide
## Personal Portfolio Website

**Version:** 1.0.0  
**Last Updated:** 2026-04-17

---

## 1. Overview

The site is deployed as a fully static export to **GitHub Pages** via **GitHub Actions**. No server, no database, no backend.

```
Local dev  →  git push origin main  →  GitHub Actions CI  →  GitHub Pages CDN
                                              │
                                    npm ci → npm run build → ./out/ → pages artifact
```

**Live URL:** https://maktheus.github.io/personal_website/

---

## 2. Prerequisites

| Requirement | Detail |
|---|---|
| Repository | `maktheus/personal_website` (public) |
| GitHub Pages | Enabled with source: **GitHub Actions** |
| Branch | `master` (default) |
| Node.js | 20.x (set in workflow) |

---

## 3. GitHub Actions Workflow

**File:** `.github/workflows/deploy.yml`

### Trigger
- Push to `master` branch
- Manual trigger (`workflow_dispatch`)

### Jobs

#### `build`
1. Checkout code (`actions/checkout@v4`)
2. Setup Node 20 with npm cache (`actions/setup-node@v4`)
3. Install dependencies (`npm ci`)
4. Build static export (`npm run build` with `NODE_ENV=production`)
   - Output directory: `./out`
   - `basePath` set to `/personal_website` in production
5. Upload artifact (`actions/upload-pages-artifact@v3`)

#### `deploy`
1. Depends on `build`
2. Deploys to GitHub Pages (`actions/deploy-pages@v4`)
3. URL output available in job summary

### Required GitHub Permissions
```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

---

## 4. Static Export Configuration

**File:** `next.config.ts`

```typescript
const isProd = process.env.NODE_ENV === "production";
const repoName = "personal_website";

const nextConfig = {
  output: "export",
  basePath: isProd ? `/${repoName}` : "",
  assetPrefix: isProd ? `/${repoName}/` : "",
  images: { unoptimized: true },
  trailingSlash: true,
};
```

**Important:** `basePath` must match the repository name exactly. If the repo is renamed, update `repoName` here.

---

## 5. Local Development

```bash
# Install dependencies
npm install

# Run dev server (hot reload, no basePath)
npm run dev
# → http://localhost:3000

# Build static export (production mode)
npm run build
# → ./out directory

# Preview static build locally
npx serve out
# → http://localhost:3000/personal_website/
```

---

## 6. Enabling GitHub Pages (one-time setup)

1. Go to **GitHub repo → Settings → Pages**
2. Under "Build and deployment", set **Source** to **GitHub Actions**
3. Push to `master` — the workflow will run automatically

Or via CLI (already done):
```bash
gh api repos/maktheus/personal_website/pages \
  -X POST \
  --field "build_type=workflow"
```

---

## 7. Custom Domain (Future — v2.0)

To use a custom domain (e.g., `matheus.dev`):

1. Update `next.config.ts`:
   ```typescript
   basePath: "",
   assetPrefix: "",
   ```
2. Add `CNAME` file in `public/` with the domain
3. Configure DNS: `A` records pointing to GitHub Pages IPs
4. Enable HTTPS in GitHub Settings → Pages

---

## 8. Updating Content

All content is in `src/lib/data.ts`. To update:

1. Edit `src/lib/data.ts`
2. Commit and push to `master`
3. GitHub Actions rebuilds and redeploys automatically (typically < 2 min)

---

## 9. Adding the CV PDF

Place the file at:
```
public/assets/cv-matheus.pdf
```

The "Download CV" button in the Hero section already links to `/assets/cv-matheus.pdf`.

---

## 10. Monitoring & Troubleshooting

### Check deployment status
```bash
gh run list --repo maktheus/personal_website --limit 5
gh run view <run-id> --repo maktheus/personal_website
```

### Common issues

| Issue | Cause | Fix |
|---|---|---|
| 404 on all pages | `basePath` mismatch | Verify `repoName` in `next.config.ts` |
| Blank canvas | `ssr: false` not applied to BoidsCanvas | Confirm `dynamic()` import in Hero.tsx |
| Font not loading | Geist not installed | `npm install geist` |
| Workflow fails | Missing Pages permissions | Check Settings → Pages → Source = Actions |
