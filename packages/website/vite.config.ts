import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  publicDir: '../../data/public',
  server: {
    cors: true,
    port: 1673,
  },
  base: '/OpenSeaMap-vector',
});
