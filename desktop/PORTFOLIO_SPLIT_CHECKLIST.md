# Simple Accounting standalone repo checklist

Use this checklist when splitting this app into its own repository.

## 1. Copy only required files

Move these items from this monorepo into the new repository root:

- all files from this directory (`projects/app/countis/desktop/`)
- workflow file: `.github/workflows/simple-accounting-pages.yml`

Do not copy monorepo-level backend folders into the standalone repo.

## 2. Set branch trigger to main

Update the workflow in `.github/workflows/simple-accounting-pages.yml`:

- set `on.push.branches` to `main`

## 3. Verify package and build

Run locally in the new repo root:

```bash
npm ci
npm run build
```

Expected output folder:

- `dist/simple-accounting/browser`

## 4. Enable GitHub Pages

In the new GitHub repository:

- Settings -> Pages
- Source: GitHub Actions

Then push `main` and confirm the workflow publishes successfully.

## 5. Optional custom domain

If desired:

- add CNAME in repo settings and DNS provider
- keep hash-routing (`withHashLocation`) unless you add rewrite support

## 6. Smoke test after publish

Verify these routes work from cold load:

- `/#/login`
- `/#/dashboard`
- `/#/intakter`

Verify mock login still works:

- `john.doe@example.com`
- `password123`
