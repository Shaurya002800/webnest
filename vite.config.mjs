import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { cpSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

const productionPublicEntries = [
  "assets/optimized",
  "assets/cinematic",
  "assets/3d/city",
  "assets/3d/coffee-shop",
  "assets/3d/LICENSES.md",
  "assets/reference/cherry-garden-royal.webp",
  "assets/reference/apartment-facade-royal.webp",
  "assets/reference/street-arrival-morning.jpg",
  "assets/generated/cherry-petal-slow.mp4",
  "assets/generated/cherry-petal-loop-LICENSE.md",
];

const copyProductionAssets = () => ({
  name: "copy-production-assets",
  closeBundle() {
    for (const entry of productionPublicEntries) {
      const source = resolve("public", entry);
      const destination = resolve("dist/client", entry);
      mkdirSync(dirname(destination), { recursive: true });
      cpSync(source, destination, { recursive: true });
    }
  },
});

export default defineConfig(({ command }) => ({
  publicDir: command === "build" ? false : "public",
  test: {
    environment: "jsdom",
    setupFiles: "./src/test-setup.ts",
    exclude: ["tests/**", "node_modules/**", "dist/**"],
  },
  build: {
    outDir: "dist/client",
  },
  optimizeDeps: {
    include: ["react", "react-dom/client"],
  },
  server: {
    host: "0.0.0.0",
    allowedHosts: ["terminal.local"],
    warmup: {
      clientFiles: ["./src/main.jsx"],
    },
  },
  plugins: [react(), copyProductionAssets()],
}));
