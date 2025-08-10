import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  cacheDir: './.vite',
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    open: true,
    cors: true,
    fs: {
      allow: [
        path.resolve(__dirname, './src'),
        path.resolve(__dirname, './public'),
        path.resolve(__dirname, './node_modules')
      ]
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  }
});