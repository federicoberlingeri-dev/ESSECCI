import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// URL pubblico: su Netlify arriva da process.env.URL; sostituire col dominio definitivo quando disponibile.
const site = process.env.SITE_URL || process.env.URL || 'https://essecci.netlify.app';

export default defineConfig({
  site,
  trailingSlash: 'always',
  integrations: [sitemap({ filter: (page) => !page.includes('/admin/') })],
});
