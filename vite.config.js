import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'  // very key
export default defineConfig({
  plugins: [react(),tailwindcss(),
  ],
});