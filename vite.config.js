import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react({
      // Enable JSX in .js files
      include: "**/*.{jsx,js}",
    }),
    tailwindcss(),
  ],
  server: {
    port: 5173,
    host: true,
    allowedHosts: true,
  },
})