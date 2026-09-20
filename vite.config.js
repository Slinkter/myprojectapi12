import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: process.env.VITE_BASE_PATH || (process.env.DEPLOY_TARGET === "gh-pages" ? "/myprojectapi12/" : "/"),
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
      "@shared": path.resolve(import.meta.dirname, "./src/shared"),
      "@features": path.resolve(import.meta.dirname, "./src/features"),
      "@entities": path.resolve(import.meta.dirname, "./src/entities"),
      "@widgets": path.resolve(import.meta.dirname, "./src/widgets"),
      "@pages": path.resolve(import.meta.dirname, "./src/pages"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/@firebase/firestore") || id.includes("node_modules/firebase/firestore")) {
            return "vendor-firestore";
          }
          if (id.includes("node_modules/@firebase/auth") || id.includes("node_modules/firebase/auth")) {
            return "vendor-auth";
          }
          if (id.includes("node_modules/firebase") || id.includes("node_modules/@firebase")) {
            return "vendor-firebase-core";
          }
          if (
            id.includes("node_modules/framer-motion") ||
            id.includes("node_modules/motion-dom") ||
            id.includes("node_modules/motion-utils")
          ) {
            return "vendor-motion";
          }
          if (id.includes("node_modules/@tanstack")) {
            return "vendor-query";
          }
        },
      },
    },
  },
});
