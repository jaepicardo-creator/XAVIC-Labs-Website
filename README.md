# XAVIC-Labs Website

Official website for **XAVIC-Labs — eXperimental Autonomous Virtual Intelligence Core**.

**One Vision. Intelligent Systems. Endless Possibilities.**

Founded and led by **Jae Picardo**. The laboratory researches intelligent digital assistants, automation, and human-AI collaboration, prioritizing adaptability, practical functionality, user control, and responsible automation.

## Stack and setup

React + Vite + TypeScript + Tailwind CSS v4. Lucide provides decorative icons; CSS provides the core and scroll animations without an animation-library dependency. Use Node.js 24 LTS and npm 11 (validated with Node 24.19.0 and npm 11.9.0).

```sh
cd /workspace/XAVIC-Labs-Website
npm ci --cache /tmp/xavic-npm-cache
npm run dev
```

The cache override supports cloud machines with a read-only home directory. On a normal local machine, `npm ci` also works. Vite binds to all interfaces and uses port 5173 by default. No backend, secrets, or environment variables are required.

## Validation and production

```sh
npm test
npm run build
npm run preview -- --port 4173
```

`npm test` runs Vitest and React Testing Library once; `npm run test:watch` watches changes. The build performs strict TypeScript checks, creates `dist/`, and generates five static project entry pages with distinct titles and description metadata. Tests exercise identity, sections, every project route and status, card links, mobile navigation, contact preview feedback, and unknown project handling.

## Browser smoke checks

With the production preview running in another terminal:

```sh
npm run test:browser
```

The smoke runner checks desktop, tablet, 390px and 320px layouts, menu interaction, every static project route and reload, project titles, contact preview, and reduced motion. It rejects page errors, failed HTTP responses, and horizontal overflow. Screenshots are written to `/tmp/xavic-*.png` for inspection. Set `XAVIC_CHECK_URL` to test another server or a subdirectory mount. The cloud environment's system Chromium is used when available; set `CHROMIUM_PATH` for another executable. Otherwise install Playwright Chromium with `npx playwright install chromium` (requires browser-download network access).

## Deployment options and limitations

The requested React/Vite stack produces a static site. **No public deployment is performed.** Deployment requires explicit approval.

- **Cloudflare Pages or other static hosting:** use build command `npm run build`, output directory `dist`, and Node 24. Project pages are real `projects/<slug>/index.html` files; no SPA fallback is required for these routes.
- **GitHub Pages:** publish the _contents_ of `dist` using an approved Pages workflow or deployment process. Relative asset URLs and navigation support a repository subdirectory such as `/XAVIC-Labs-Website/`. Do not publish the source checkout as the site. A repository-wide custom domain is optional and not configured.
- Keep the generated project folders and assets together. All project links use trailing slashes. This is a client-rendered React site with static route metadata, not server-rendered content.
- The contact form is an interface preview. It validates input locally and explicitly reports that **nothing is sent or stored**. Configure an approved backend or service separately before enabling actual delivery. Email, GitHub contact, and social profiles are labeled placeholders; no contact information is invented.

## Structure and content

- `src/App.tsx`: homepage sections, navigation integration, scroll reveal setup, route selection, and unknown-project state.
- `src/components/`: reusable header, section title, project card/page, and contact form.
- `src/data/projects.json`: confirmed project names, descriptions, statuses, and K.A.T.H. flagship details. Shared by rendering and static-page generation.
- `src/style.css`: dark navy interface, cyan/violet accents, responsive breakpoints, visible keyboard focus, reduced-motion support, and abstract AI graphics.
- `scripts/browser-smoke.mjs`: repeatable Chromium checks against the built site.
- `scripts/generate-pages.mjs`: generates project HTML entries and SEO metadata after Vite builds.
- `src/App.test.tsx`: functional component tests.

Homepage sections include the official identity and tagline; About with mission, vision, and philosophy; K.A.T.H., A.R.I.A., XAVIC, Zyro, and Jae; all seven laboratory research directions; all five Command Center departments; a development timeline without fabricated release dates; the web technology stack; the founder; and contact placeholders/form preview. The Command Center is a public visual overview and exposes no internal dashboards, records, or credentials. Project descriptions express design goals and do not assert completed functionality or released products. Placeholder graphics use CSS and icons, with no unapproved branding assets or third-party image requests.

## Review

Development branch: `development/xavic-website`, preserving the existing `main` history. No merge is performed. Review all sections, every project page, mobile menu and form feedback, and deployment output before publication. Official contact values and a delivery service remain intentionally unconfigured.

Developed using OpenAI Codex.
