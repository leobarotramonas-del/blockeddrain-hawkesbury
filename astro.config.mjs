import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  site: 'https://blockeddrainshawkesbury.com.au',
  trailingSlash: 'never',
  build: { format: 'directory', inlineStylesheets: 'always' },
});
