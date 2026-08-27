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
});
