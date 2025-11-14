// vite.config.js (en la raíz del proyecto React)
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // Configuración del Proxy
    proxy: {
      // Redirige todas las llamadas a /api/* al backend en 3001
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true, 
        secure: false, 
      },
    },
  },
});