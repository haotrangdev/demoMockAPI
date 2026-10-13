import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' để deploy được cả Vercel / Netlify / GitHub Pages
export default defineConfig({ plugins: [react()], base: './' })
