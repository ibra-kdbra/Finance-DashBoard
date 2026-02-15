import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: "@", replacement: path.resolve(__dirname, "src") },
      { find: "@domain", replacement: path.resolve(__dirname, "src/domain") },
      { find: "@data", replacement: path.resolve(__dirname, "src/data") },
      { find: "@presentation", replacement: path.resolve(__dirname, "src/presentation") },
    ],
  },
});
