import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './', // Cambia esto por el nombre exacto de tu repositorio
  plugins: [react()],
});
