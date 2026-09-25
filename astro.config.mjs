import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  site: 'https://quickbmicalc.com',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'pt', 'de'],
    routing: {
      prefixDefaultLocale: false
    }
  }
});
