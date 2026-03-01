import { defineConfig } from 'vitest/config';
import dts from 'vite-plugin-dts';
import { webdriverio } from '@vitest/browser-webdriverio';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      fileName: 'navmark-renderer',
      formats: ['es'],
    },
  },
  plugins: [dts({ rollupTypes: true })],
  test: {
    projects: [
      {
        test: {
          include: ['**/*.test.ts*'],
          name: 'unit',
          environment: 'node',
        },
      },
      {
        test: {
          include: ['**/*.cy.ts*'],
          name: 'browser',
          browser: {
            enabled: true,
            provider: webdriverio(),
            instances: [{ browser: 'chrome' }],
            isolate: true,
          },
        },
      },
    ],
  },
});
