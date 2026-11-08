import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Keep the REACT_APP_* names used by the Docker build args and installer.
  envPrefix: 'REACT_APP_',
  server: { port: 3000, host: true },
  preview: { port: 3000, host: true },
  build: { outDir: 'build' },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.js',
    css: false,
    // Node 25+ ships its own (file-backed) localStorage that shadows jsdom's.
    execArgv: ['--no-experimental-webstorage'],
    coverage: { include: ['src/**/*.{js,jsx}'], reportsDirectory: 'coverage' },
  },
});
