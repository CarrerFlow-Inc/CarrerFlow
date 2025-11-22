import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 3000,
    open: true,
  },
  preview: {
    host: true,
  },
  build: {
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          recharts: ["recharts"],
          swiper: ["swiper"],
          chartjs: ["chart.js", "react-chartjs-2"],
          lucide: ["lucide-react"],
        },
      },
    },
  },
});
