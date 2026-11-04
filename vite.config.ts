import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const leadsEndpoint = env.LEADS_ENDPOINT || process.env.LEADS_ENDPOINT || env.VITE_LEADS_ENDPOINT || "";
  const siteUrl = env.SITE_URL || process.env.SITE_URL || env.VITE_SITE_URL || "https://adinarayanbuildconllp.com";
  const mediaBase = env.MEDIA_BASE || process.env.MEDIA_BASE || env.VITE_MEDIA_BASE || "";

  return {
    envPrefix: ["VITE_", "LEADS_", "SITE_", "MEDIA_"],
    define: {
      "import.meta.env.LEADS_ENDPOINT": JSON.stringify(leadsEndpoint),
      "import.meta.env.SITE_URL": JSON.stringify(siteUrl),
      "import.meta.env.MEDIA_BASE": JSON.stringify(mediaBase),
    },
    plugins: [react(), tailwindcss()],
    build: {
      target: "es2020",
      emptyOutDir: false,
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
  };
});
