import { mkdir, readFile, writeFile, cp } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const ROOT = process.cwd();
const DIST = path.join(ROOT, 'dist');
const SSR_ENTRY = path.join(ROOT, 'dist-ssr', 'entry-server.js');

const SITE = 'https://akshat-saxena-portfolio.vercel.app';

/** Route, output file, and per-route head overrides. */
const ROUTES = [
  { url: '/', out: 'index.html' },
  { url: '/work/newme', out: 'work/newme/index.html' },
  { url: '/work/traya', out: 'work/traya/index.html' },
  { url: '/work/chotu', out: 'work/chotu/index.html' },
];

if (!existsSync(SSR_ENTRY)) {
  console.error('SSR bundle missing at', SSR_ENTRY);
  console.error('Run: npm run build:ssr');
  process.exit(1);
}

// Windows requires a file:// URL for absolute paths in the ESM loader.
const { render } = await import(pathToFileURL(SSR_ENTRY).href);
const template = await readFile(path.join(DIST, 'index.html'), 'utf8');

const inject = (html, body, overrides) => {
  let out = html;

  for (const [needle, value] of Object.entries(overrides)) {
    if (!needle || value === undefined) continue;
    const re = new RegExp(`(<meta[^>]*${needle}=("|'))${value}\\2`, 'i');
    out = out.replace(re, `$1${String(value).replace(/\$/g, '$$$$')}`);
  }

  // Replace the empty mount point with the rendered markup.
  out = out.replace(
    '<div id="root"></div>',
    `<div id="root">${body}</div>`
  );
  return out;
};

let count = 0;

for (const route of ROUTES) {
  const body = render(route.url);

  // Case study pages get their own title and canonical URL.
  let overrides = {};
  if (route.url.startsWith('/work/')) {
    const slug = route.url.replace('/work/', '');
    const title = {
      newme: 'NEWME Retention Analysis | Akshat Saxena',
      traya: 'Traya Checkout Conversion Case Study | Akshat Saxena',
      chotu: 'Chotu Quick-Commerce PRD | Akshat Saxena',
    }[slug];
    if (title) {
      overrides = { title };
      const html = inject(template, body, {});
      const out = html
        .replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
        .replace(
          /<link rel="canonical" href="[^"]*"/,
          `<link rel="canonical" href="${SITE}${route.url}"`
        )
        .replace(
          /(<meta property="og:url" content=")[^"]*(")/,
          `$1${SITE}${route.url}$2`
        );
      await mkdir(path.dirname(path.join(DIST, route.out)), { recursive: true });
      await writeFile(path.join(DIST, route.out), out, 'utf8');
      count++;
      continue;
    }
  }

  await mkdir(path.dirname(path.join(DIST, route.out)), { recursive: true });
  await writeFile(path.join(DIST, route.out), inject(template, body, overrides), 'utf8');
  count++;
}

// A root-level html file per case study, so hosts without clean-URL support
// still serve the prerendered markup at /work/newme.html and so.
for (const route of ROUTES.filter((r) => r.url !== '/')) {
  const src = path.join(DIST, route.out);
  if (existsSync(src)) {
    await cp(src, path.join(DIST, route.out.replace('/index.html', '.html')));
  }
}

console.log(`prerendered ${count} routes into dist/`);
