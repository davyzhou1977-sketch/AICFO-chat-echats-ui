import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const appRoot = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: appRoot,
  plugins: [react()],
  server: {
    host: "127.0.0.1",
    port: 4174,
    strictPort: true,
  },
  preview: {
    host: "127.0.0.1",
    port: 4274,
    strictPort: true,
  },
  css: {
    modules: {
      scopeBehaviour: "local",
      globalModulePaths: [/global\.less$/],
      localsConvention: "camelCaseOnly",
    },
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(appRoot, "src"),
    },
  },
  build: {
    outDir: path.resolve(appRoot, "dist"),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          echarts: ["echarts"],
          react: ["react", "react-dom"],
        },
      },
    },
  },
});
