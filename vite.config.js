import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/PetCare/',
  server: {
    host: '0.0.0.0', // Открывает сервер для внешних подключений
    port: 5173,      // Убедитесь, что порт совпадает
  },
});
