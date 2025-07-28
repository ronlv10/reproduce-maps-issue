import { defineConfig } from "vite";

export default defineConfig({
  root: ".",
  publicDir: "public",
  server: {
    port: 3000,
    host: true,
    open: true,
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: true,
  },
  optimizeDeps: {
    include: ["@googlemaps/markerclusterer"],
  },
  // Ensure environment variables are available
  define: {
    "process.env": {},
  },
});
