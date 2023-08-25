import { defineConfig } from "vite";
import htmlMinifier from 'vite-plugin-html-minifier';

export default defineConfig({
  base: "/TensorFlow.JS_Toxicity_Detector/",
  server: {
    port: 8001,
  },
  plugins: [
    htmlMinifier({
      minify: true
    })
  ]
});
