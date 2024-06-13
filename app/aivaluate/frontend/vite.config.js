import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/stu': {
        target: 'http://localhost:4000', // Backend server URL for students
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/stu/, ''),
      },
      '/prof': {
        target: 'http://localhost:4000', // Backend server URL for professors
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/prof/, ''),
      },
      '/admin': {
        target: 'http://localhost:4000', // Backend server URL for administrators
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/admin/, ''),
      },
    },
  },
});
