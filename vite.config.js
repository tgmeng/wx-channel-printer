import { resolve, dirname } from "path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

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
  plugins: [dts()],
});
