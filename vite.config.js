import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),],
  server: {
    proxy: {
      // any request to /ws on 5173 will be forwarded to 8080
      '/ws': {
        target: 'http://localhost:8080',  // your Spring Boot port
        changeOrigin: true,
        ws: true,                         // << must enable WebSocket proxying
      }
    }
  }
})
