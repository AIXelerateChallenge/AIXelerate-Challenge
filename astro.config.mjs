import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://aixeleratechallenge.org',
  // Trailing-slash-free URLs so /about matches the old /about.html links
  // once the redirects below are in place.
  build: { format: 'file' },
  compressHTML: true,
  integrations: [sitemap()],
  redirects: {
    // The old site shipped events.html and previous-events.html as
    // near-identical duplicates. One canonical page now; the other redirects.
    '/previous-events': '/events',
  },
});
