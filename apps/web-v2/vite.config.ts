import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const appRoot = path.dirname(fileURLToPath(import.meta.url));

function webLessModuleImportPlugin() {
  return {
    name: "web-less-module-import",
    enforce: "pre" as const,
    async resolveId(source: string, importer?: string) {
      if (!importer || !source.endsWith(".less") || source.endsWith("global.less")) {
        return null;
      }

      const resolved = await this.resolve(source, importer, { skipSelf: true });
      if (!resolved || !resolved.id.endsWith(".less") || resolved.id.endsWith("global.less")) {
        return null;
      }

      const moduleBridgeId = resolved.id.replace(/\.less$/, ".module.less");
      if (!fs.existsSync(moduleBridgeId)) {
        return null;
      }

      return moduleBridgeId;
    },
  };
}

export default defineConfig({
  root: appRoot,
  plugins: [webLessModuleImportPlugin(), react()],
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
