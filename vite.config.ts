import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  server: {
    port: 3001,
  },
  plugins: [
    react(),

    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
      },

      manifest: {
        name: "Ramp.fun",
        short_name: "Ramp.fun",

        scope: "/",
        start_url: "/",
        display: "standalone",
        theme_color: "#111",
        orientation: "portrait",
        background_color: "#111",
        description: "Ramp.fun - Buy and create tokens",

        icons: [
          {
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
            src: "assets/images/app/icon512_maskable.png",
          },
          {
            purpose: "any",
            sizes: "512x512",
            type: "image/png",
            src: "assets/images/app/icon512_rounded.png",
          },
        ],
      },
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "./src/scss/utils/fonts.scss";
          @import "./src/scss/base/variables.scss";
          @import "./src/scss/utils/mixins.scss";
          @import "./src/scss/base/partials.scss";
          @import "./src/scss/utils/functions.scss";
          @import "./src/scss/utils/_breakpoints.scss";
        `,
      },
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        ".glsl": "text",
        ".frag": "text",
      },
    },
  },
  resolve: {
    alias: {
      utils: path.resolve(__dirname, "./src/utils"),
      types: path.resolve(__dirname, "./src/types"),
      hooks: path.resolve(__dirname, "./src/hooks"),
      pages: path.resolve(__dirname, "./src/pages"),
      helpers: path.resolve(__dirname, "./src/helpers"),
      contracts: path.resolve(__dirname, "./src/contracts"),
      constants: path.resolve(__dirname, "./src/constants"),
      components: path.resolve(__dirname, "./src/components"),
      contexts: path.resolve(__dirname, "./src/contexts/index.ts"),
    },
  },
});
