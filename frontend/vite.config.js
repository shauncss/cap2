import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // 1. Output directly to the backend folder!
    outDir: '../backend/dist',
    
    // 2. Clear the folder before building (deletes old files automatically)
    emptyOutDir: true,
  }
})