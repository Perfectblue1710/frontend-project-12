import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
      '/socket.io': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        ws: true,
      },
    },
  },
  define: {
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      REACT_APP_ROLLBAR_TOKEN: JSON.stringify(process.env.REACT_APP_ROLLBAR_TOKEN),
    },
  },
});
