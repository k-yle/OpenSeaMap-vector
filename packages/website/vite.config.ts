import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const IS_LIB_BUILD = process.env.VITE_BUILD_MODE === 'lib';

export default defineConfig({
  plugins: [react()],
  publicDir: '../../data/public',
  server: {
    cors: true,
    port: 1673,
  },
  esbuild: {
    target: 'es2022',
    legalComments: 'none',
  },
  base: '/OpenSeaMap-vector',
  define: { 'process.env.NODE_ENV': "'production'" }, // for react
  build: {
    sourcemap: true,
    emptyOutDir: IS_LIB_BUILD,
    lib: IS_LIB_BUILD && {
      entry: resolve(import.meta.dirname, 'src/index-iD-plugin.tsx'),
      formats: ['es'],
      fileName: 'iD-plugin',
    },
  },
});
