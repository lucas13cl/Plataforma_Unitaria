import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Em desenvolvimento, /api é encaminhado ao backend (http://localhost:5000).
// Em produção (serviço único no Render), o backend serve o build e a API na mesma origem.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': 'http://localhost:5000'
    }
  },
  preview: {
    port: 4173,
    host: true
  }
});
