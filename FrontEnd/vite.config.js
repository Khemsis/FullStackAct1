import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    global: 'window', // Esto le dice a Vite: "cuando veas global, usa window"
  },
})