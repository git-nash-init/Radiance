import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    target: "es2020",
    // The 3DVista tour, videos and PDFs are served as-is from public/.
    assetsInlineLimit: 0,
    rolldownOptions: {
      output: {
        // Long-lived vendor chunks so content edits don't bust library caches.
        codeSplitting: {
          groups: [
            { name: "react", test: /node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/, priority: 30 },
            { name: "motion", test: /node_modules[\\/](gsap|lenis|framer-motion|motion-dom|motion-utils)[\\/]/, priority: 20 },
          ],
        },
      },
    },
  },
  server: { port: 5188 },
  preview: { port: 4173 },
});
