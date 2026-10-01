# Akshat Saxena, Portfolio

Personal portfolio site for my applications to **Associate Product Manager** roles.

> **Live site:** add your deployed URL here.

Computer Science graduate (B.Tech '26) with two product internships across **B2B internal
tools** and **logistics**: AmberStudent (CRM & CMS) and Swift Logistics. I work from SQL
and data through to requirements, prioritisation and QA after launch.

---

## What I work on

| Area | Examples |
| --- | --- |
| **Root cause analysis** | A 23% YoY drop in call pickup rates traced to a 15 second voicemail threshold counting missed calls as pickups |
| **Product ownership** | Requirements, prioritisation and QA for a CMS revamp used by supply, content and SEO teams |
| **Automation** | 3 shipped CRM automations replacing ~4 to 5 manual resets per day; AI assisted Slack bot cutting escalation resolution time by 32% |
| **Revenue & retention** | 60 day retention analysis (10.55% baseline to 14 to 15% target); teardown of an 11% conversion funnel within 24 hours |

## Case studies

Three end to end pieces of product work, each starting from a defined metric and ending
with a prioritised recommendation:

1. **NEWME, Retention Analysis & Strategy** · cohort analysis, lifecycle journeys
2. **Traya, Product Teardown: Checkout Conversion** · funnel analysis, impact/effort matrix, PRD
3. **Chotu, Hyperlocal Quick Commerce PRD** · PRD writing, MVP scoping, payments design

## Skills

- **Product:** PRD writing, requirements gathering, prioritisation (RICE, impact/effort), user research & interviews, user journey mapping, roadmapping, root cause analysis, Agile/Scrum, sprint planning
- **Data & tools:** SQL (BigQuery, Metabase), MongoDB, funnel & cohort analysis, A/B test design, Jira, Figma/FigJam, n8n, LLM workflows, Claude, Notion

## Tech stack

This site is intentionally simple: plain React + TypeScript, styled with Tailwind via CDN,
built with Vite. No backend.

* React 19, TypeScript, Vite 6
* Tailwind CSS (CDN)
* `lucide-react` for icons

## Running locally

**Prerequisites:** Node.js 18+

```bash
npm install
npm run dev         # compile CSS, then start the dev server
npm run dev:css     # Tailwind in watch mode only
npm run build       # CSS + client + SSR bundle + prerender
npm run preview     # serve the built output
```

`npm run build` runs four steps:

1. `build:css` compiles `tailwind.input.css` to `public/styles.css`
2. `build:client` bundles the app to `dist/`
3. `build:ssr` bundles `prerender/entry-server.tsx` to `dist-ssr/`
4. `prerender` renders every route to static HTML in `dist/`

## Why prerender

The app is a single page app, so without prerendering crawlers and link
unfurlers (LinkedIn, WhatsApp, Slack) receive an empty `<div id="root">`.
`prerender/run.mjs` renders each route with `react-dom/server` and injects the
markup, so the shipped HTML contains real content.

Emitted pages:

| Route | Output |
| --- | --- |
| `/` | `dist/index.html` |
| `/work/newme` | `dist/work/newme/index.html` |
| `/work/traya` | `dist/work/traya/index.html` |
| `/work/chotu` | `dist/work/chotu/index.html` |

Each case study also gets its own `<title>`, canonical URL and `og:url`. If your
host does not resolve clean URLs, the flat `dist/work/<slug>.html` copies are
emitted as a fallback.

## Tailwind

Tailwind is compiled at build time from `tailwind.input.css` using
`tailwind.config.js`, not loaded from a CDN. A CDN script was render blocking
and cost roughly 20 points of mobile Lighthouse performance.

Class names are literal strings throughout, so the static content scan finds
them. If you ever build a class name by interpolation, add it to `safelist` in
`tailwind.config.js`.

## Project structure

```
components/       # one component per section (Hero, CaseStudies, Experience, ...)
constants.ts      # all site content: resume, experience, case studies, projects, skills
types.ts          # TypeScript interfaces
public/assets/    # images
index.html        # entry point, meta tags, JSON-LD Person schema
```

**All content lives in `constants.ts`**: edit text there, not in the components.

## Links

* **LinkedIn:** https://www.linkedin.com/in/akshat-saxena-5513a8258
* **GitHub:** https://github.com/axstorch
* **Email:** akshatsaxena7974@gmail.com
