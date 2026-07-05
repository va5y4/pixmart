import { defineConfig } from 'vite';
import vituum from 'vituum';
import nunjucks from '@vituum/vite-plugin-nunjucks';
import twig from '@vituum/vite-plugin-twig';
import postcss from '@vituum/vite-plugin-postcss';

import imageOptimizer from '@bro-academy/vite-plugin-image-optimizer';
import svgSprite from '@bro-academy/vite-plugin-svg-sprite';

const pageInputs = [
  'src/pages/index.twig',
  'src/pages/blog.twig',
  'src/pages/catalog.twig',
  'src/pages/contact.twig',
];

export default defineConfig({
  server: {
    open: '/index.twig.html',
  },
  plugins: [
    // redirect / → /index.twig.html so the dev server shows the home page
    {
      name: 'root-redirect',
      configureServer(server) {
        const routeRedirects = {
          '/': '/index.twig.html',
          '': '/index.twig.html',
          '/index.twig': '/index.twig.html',
          '/blog.twig.html': '/blog',
          '/blog.twig': '/blog',
          '/catalog.twig.html': '/catalog',
          '/catalog.twig': '/catalog',
          '/contact.twig.html': '/contact',
          '/contact.twig': '/contact',
        };

        server.middlewares.use((req, res, next) => {
          const redirectTarget = routeRedirects[req.url ?? ''];

          if (redirectTarget) {
            res.writeHead(302, { Location: redirectTarget });
            res.end();
            return;
          }
          next();
        });
      },
    },
    svgSprite(),
    vituum(),
    twig(),
    nunjucks(),
    postcss(),
    // imageOptimizer() removed temporarily to avoid copyfile errors during build
  ],
  build: {
    assetsInlineLimit: 0,
    rolldownOptions: {
      input: pageInputs,
    },
    rollupOptions: {
      input: pageInputs,
    },
  },
});
