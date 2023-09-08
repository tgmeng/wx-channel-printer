import { resolve, dirname } from "path";
import { defineConfig } from "vite";

import { fileURLToPath } from "node:url";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(dirname(fileURLToPath(import.meta.url)), "src/index"),
      name: "WxChannelPrinter",
      fileName: "wx-channel-printer",
    },
    rollupOptions: {
      output: {},
    },
  },
});
