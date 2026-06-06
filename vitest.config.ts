/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';

// Plain Vitest config: the test suite only covers pure logic modules
// (content.ts plus pure src/lib/ modules — currently github.ts and shapes.ts).
// Astro's `getViteConfig` fails to load in this
// environment ("Unknown Error: [object Object]") and isn't needed here, since
// component/markup tasks are verified via the build + SEO grep assertions
// rather than through Vitest.
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
});
