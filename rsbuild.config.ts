import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginTailwindcss } from '@rsbuild/plugin-tailwindcss';
import { tanstackStart } from '@tanstack/react-start/plugin/rsbuild';

export default defineConfig({
  plugins: [
    pluginReact(),
    pluginTailwindcss(),
    tanstackStart({
      // The site is deployed as static files from dist/client.
      prerender: {
        enabled: true,
      },
      pages: [{ path: '/' }],
    }),
  ],
});
