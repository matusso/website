import { loadEnv } from "vite";
import { defineConfig } from 'astro/config';

import expressiveCode from 'astro-expressive-code';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import spectre from './package/src';

import node from '@astrojs/node'
import { spectreDark } from './src/ec-theme';

// https://astro.build/config
const config = defineConfig({
  site: 'https://burso.eu',
  output: 'static',
  integrations: [
    expressiveCode({
      themes: [spectreDark],
    }),
    mdx(),
    sitemap(),
    spectre({
      name: '.burso',
      openGraph: {
        home: {
          title: '.burso.eu',
          description: 'A blog about my work and personal life.'
        },
        blog: {
          title: 'Blog',
          description: 'News and guides from m3.'
        },
        projects: {
          title: 'Projects',
          description: 'Projects im working on.'
        }
      }
    })
  ],
  adapter: node({
    mode: 'standalone'
  })
});

export default config;