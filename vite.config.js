import react from '@vitejs/plugin-react';
import process from 'node:process';
import { defineConfig, loadEnv } from 'vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const port = Number(env.APP_PORT) || 3000;

  return {
    base: env.VITE_BASE_PATH || '/',
    plugins: [react()],
    define: {
      // Base URL REST API VoteDel (back-end berada pada repository & deployment terpisah).
      VOTEDEL_BASEURL: JSON.stringify(env.VITE_API_URL || '/api'),
    },
    server: {
      port,
      proxy: {
        '/api': { target: env.VITE_DEV_API_PROXY || 'http://localhost:8000', changeOrigin: true },
      },
    },
    preview: { port },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            redux: ['@reduxjs/toolkit', 'react-redux'],
          },
        },
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/setupTests.js',
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html', 'lcov'],
        include: ['src/**/*.{js,jsx}'],
        exclude: [
          'src/main.jsx',
          'src/setupTests.js',
          'src/test-utils.jsx',
          '**/*.test.{js,jsx}',
          'node_modules/**',
        ],
      },
    },
  };
});
