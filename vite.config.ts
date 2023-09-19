import { resolve, dirname } from "path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(dirname(fileURLToPath(import.meta.url)), "src/index"),
      name: "WxChannelShopPrinter",
      fileName: "wx-channel-shop-printer",
    },
    rollupOptions: {
      output: {},
    },
  },
  plugins: [vue(), dts()],
});
