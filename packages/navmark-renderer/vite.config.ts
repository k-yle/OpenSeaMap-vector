import { defineConfig } from 'vitest/config';
import { webdriverio } from '@vitest/browser-webdriverio';

export default defineConfig({
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
