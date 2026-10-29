/// <reference types="vitest/config" />
import netlify from '@netlify/vite-plugin-tanstack-start';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import tailwindcss from '@tailwindcss/vite';
import { devtools } from '@tanstack/devtools-vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';

const dirname =
  typeof import.meta.dirname !== 'undefined'
    ? import.meta.dirname
    : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
const config = defineConfig(({ mode }) => {
  const isDevMode = mode !== 'production';

  return {
    build: { sourcemap: isDevMode },
    css: { devSourcemap: isDevMode },
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
    },
    optimizeDeps: {
      include: ['@mui/icons-material'],
    },
    plugins: [
      devtools(),
      isDevMode &&
        checker({
          eslint: {
            lintCommand: 'eslint "./src/**/*.{ts,tsx}"',
          },
          typescript: true,
        }),
      tailwindcss(),
      tanstackStart(),
      // react's vite plugin must come after start's vite plugin
      viteReact(),
      netlify(),
    ].filter(Boolean),
    preview: {
      port: 8080,
      strictPort: true,
    },
    resolve: {
      tsconfigPaths: true,
    },
    server: {
      port: 3000,
      strictPort: true,
    },
    test: {
      projects: [
        {
          extends: true,
          plugins: [
            // The plugin will run tests for the stories defined in your Storybook config
            // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
            storybookTest({
              configDir: path.join(dirname, '.storybook'),
            }),
          ],
          test: {
            browser: {
              enabled: true,
              headless: true,
              instances: [
                {
                  browser: 'chromium',
                },
              ],
              provider: playwright({}),
            },
            name: 'storybook',
          },
        },
      ],
    },
  };
});

export default config;
