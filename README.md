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
lib/analytics.ts  # cookie-less client tracker, one delegated click listener
lib/useragent.ts  # UA parsing, shared by the client and the function
api/track.ts      # Vercel function: filter bots, add geo, forward to the webhook
apps-script/      # track.gs, the Google Sheet + Gmail webhook to deploy by hand
public/assets/    # images
index.html        # entry point, meta tags, JSON-LD Person schema
```

**All content lives in `constants.ts`**: edit text there, not in the components.

## Visit tracking

Tells you when somebody opens the site, which case study they read, and when
they download the resume. No cookies, no visitor IDs, no third-party analytics
script, and no consent banner.

### How it fits together

```
link click / route change          client, ~1 KB
        |
        v
POST /api/track  ------------------>  Vercel function  (api/track.ts)
   drops bots, adds country/city        |
   from Vercel's edge headers,           v
   collapses repeats          POST to TRACK_WEBHOOK_URL
                                          |
                                          v
                              Google Apps Script  (apps-script/track.gs)
                                 appends a Sheet row
                                 emails you for the events that matter
                                 optional daily digest
```

The function exists because the browser cannot do three of those jobs: it
cannot be trusted to report its own device, it does not know where the visitor
is, and it cannot tell a person from LinkedIn's link unfurler.

### What you learn about a visitor

| Field | Source | Example |
| --- | --- | --- |
| Event | client, validated against an allowlist | `case_study_view` |
| Page | client route | `/work/traya` |
| Time | server | `2026-10-17T11:58:24Z` |
| Referrer | request header | `linkedin.com` |
| Country, region, city | `x-vercel-ip-*` headers | `IN`, `Karnataka`, `Bengaluru` |
| Device, browser, OS | parsed from the real UA | `Mobile`, `Safari`, `iOS` |
| Screen, language, UTC offset | client | `390x844`, `en-IN`, `5.5` |

You cannot get their name, email or employer. Nobody can, unless they type it
into your Contact form.

### What is deliberately not collected

* **No cookies, no localStorage, no visitor ID.** Repeat visits are not linked.
* **No IP address stored or forwarded.** The address is hashed in memory for
  de-duplication only and dies with the function instance.
* **No third-party scripts**, so no data leaves the site before it reaches your
  own Apps Script.

### Events

| Event | Fires when | Email |
| --- | --- | --- |
| `page_view` | any route loads or changes | yes, once per visitor per minute |
| `case_study_view` | a `/work/*` route is opened | yes |
| `case_study_click` | "Read case study" is clicked | yes |
| `resume_click` | any resume link is clicked | yes, subject line says RESUME DOWNLOADED |
| `contact_click` | the email address is clicked | yes |
| `document_click` | a certificate or PRD attachment is opened | sheet only |
| `outbound_click` | LinkedIn, GitHub, a post | sheet only |

Bots are dropped before anything is forwarded, including the ones that run
JavaScript: Googlebot, Bingbot, LinkedInBot, Slackbot, WhatsApp and every
link-preview agent. One visitor reloading, or a double click, produces one
notification.

### Setup

1. **Apps Script.** Open <https://script.google.com>, create a project, paste
   `apps-script/track.gs` into `Code.gs`, and set `ALERT_TO` at the top.
   Deploy as a Web app with **Execute as: Me** and **Who has access: Anyone**
   (not "Anyone with a Google account", because the request comes from Vercel
   with no Google session). Copy the URL ending in `/exec`.
2. **Vercel.** Add that URL as the environment variable `TRACK_WEBHOOK_URL`
   (Settings > Environment Variables), then redeploy.
3. **Daily digest.** Run `setupDigest()` once from the Apps Script editor for a
   summary email each morning. `testEvent()` sends a fake visit so you can
   check the format without waiting for a real one.

Without `TRACK_WEBHOOK_URL` the site behaves exactly as before and the events
are dropped with one warning in the logs.

### Local development

`vercel dev` serves the `/api/track` function, so tracking is testable locally.
Under plain `npm run dev` the endpoint 404s, which is harmless: every call is
fire-and-forget and swallows its errors.

### Opting out

Respecting Do Not Track and Global Privacy Control is built in, and so are two
manual switches: append `?track=0` to the URL, or run
`window.__PORTFOLIO_TRACKING__ = false` in the console.

Override the classification for any single link with a `data-track` attribute,
for example `data-track="resume_click"`.

### Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| `FUNCTION_INVOCATION_FAILED` on `/api/track` | The function threw before running, usually an import from outside `api/` | `api/track.ts` must stay self-contained. Confirm with `/api/health` |
| `/api/health` also 500s | Problem is project wide, not in `track.ts` | Check the Node version and that `package.json` still has `"type": "module"` |
| `404` on `/api/track` | The function is not in the deployed build | Confirm `api/track.ts` is committed and pushed; Vercel builds from Git |
| Log warning: `TRACK_WEBHOOK_URL is not set` | Environment variable missing on this deployment | Add it, then **redeploy**: variables only apply to builds made after they are added |
| Rows land but no email arrives | `alert` was false for that event, or Gmail's daily `MailApp` quota was hit | Consumer Gmail allows 100 sends/day |
| Nothing at all, no request in the network tab | Do Not Track or Global Privacy Control is on, or an extension blocked it | Check `navigator.doNotTrack` in the console |

`/api/health` is a three-line endpoint that exists purely to tell those first
two apart. It imports nothing, so it isolates the function layer from
`track.ts`.

---

## Links

* **LinkedIn:** https://www.linkedin.com/in/akshat-saxena-5513a8258
* **GitHub:** https://github.com/axstorch
* **Email:** akshatsaxena7974@gmail.com
