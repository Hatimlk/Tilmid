// Regenerates public/sitemap.xml from the real SPA routes and the school dataset.
// Slugs mirror src/constants/schools.ts (toSlug + `${Sigle || Établissement}-${Ville}`),
// so every school URL listed here matches a /higher-schools/:slug route.
// Run: node scripts/generate-sitemap.cjs
const fs = require('fs');
const path = require('path');

const SITE = 'https://tilmide.ma';
const root = path.join(__dirname, '..');

const toSlug = (s) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const dataset = JSON.parse(
  fs.readFileSync(path.join(root, 'src/data/ecoles_superieures_maroc_2026_complet.json'), 'utf8')
);
const schoolSlugs = [...new Set(dataset.data.map((row) => toSlug(`${row.Sigle || row['Établissement']}-${row['Ville']}`)))];

// Public, indexable routes only. Admin, login, student area and form pages are noindex
// and must not be listed. Routes that do not exist in src/App.tsx must not be listed either.
const staticPages = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/tawjih', priority: '0.9', changefreq: 'monthly' },
  { path: '/higher-schools', priority: '0.9', changefreq: 'weekly' },
  { path: '/coaching-offer', priority: '0.9', changefreq: 'weekly' },
  { path: '/bac-simulator', priority: '0.8', changefreq: 'monthly' },
  { path: '/about', priority: '0.6', changefreq: 'yearly' },
  { path: '/contact', priority: '0.7', changefreq: 'yearly' },
  { path: '/privacy-policy', priority: '0.3', changefreq: 'yearly' },
];

const urls = [
  ...staticPages.map((p) => ({ loc: `${SITE}${p.path}`, ...p })),
  ...schoolSlugs.map((slug) => ({ loc: `${SITE}/higher-schools/${slug}`, priority: '0.7', changefreq: 'monthly' })),
];

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...urls.map((u) => [
    '  <url>',
    `    <loc>${u.loc}</loc>`,
    `    <changefreq>${u.changefreq}</changefreq>`,
    `    <priority>${u.priority}</priority>`,
    '  </url>',
  ].join('\n')),
  '</urlset>',
  '',
].join('\n');

fs.writeFileSync(path.join(root, 'public/sitemap.xml'), xml, 'utf8');
console.log(`sitemap.xml written: ${urls.length} URLs (${staticPages.length} static, ${schoolSlugs.length} schools)`);
