// frontend/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Ensure frontend runs on port 3000
    open: true, // Automatically open in browser
  },
  // publicDir: 'public', // Default is 'public', so this is usually not needed unless changing
});
