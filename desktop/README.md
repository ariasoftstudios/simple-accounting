# Simple Accounting Portfolio

This desktop frontend is now configured as a standalone portfolio app that runs entirely on mock data. It no longer requires the backend API in order to log in, load invoices, upload attachments, or create invoices.

## Mock mode

The mock source of truth lives in `src/app/mock.ts`.

Default demo login:

- Email: `john.doe@example.com`
- Password: `password123`

## Local development

Install dependencies and start the Angular app:

```bash
npm ci
npm start
```

The app is available at `http://localhost:4200/`.

## Production build

Build the portfolio app with:

```bash
npm run build
```

The static output is generated in `dist/simple-accounting/browser`.

## GitHub Pages

This app has been prepared for static hosting with:

- relative asset paths via `src/index.html`
- hash-based routing via `src/app/app.config.ts`
- a Pages workflow at `.github/workflows/simple-accounting-pages.yml`

If you keep it in this repository, the workflow can deploy from the `feat/portfolio-mock-frontend` branch after GitHub Pages is configured to use GitHub Actions.

## Making it a separate repository

That is the cleaner long-term option if you want its own URL and portfolio identity.

Recommended flow:

1. Keep this branch as the source of truth for the portfolio conversion.
2. Create a new repository, for example `simple-accounting-portfolio`.
3. Copy the contents of this desktop app into the new repository root.
4. Move `.github/workflows/simple-accounting-pages.yml` into the new repository unchanged.
5. Push to `main` in the new repository and enable GitHub Pages with GitHub Actions.

In the standalone repository, the site URL will be tied to that repository instead of this monorepo.
