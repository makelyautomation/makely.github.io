// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Necesario para que GitHub Pages resuelva correctamente las rutas
  base: '/makely-landing-core-energy/',
})