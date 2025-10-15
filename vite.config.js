import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? '/edustore/' : '/edustore/',
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
  },
})
