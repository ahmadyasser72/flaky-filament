// @ts-check
import { defineConfig, envField } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import svelte from "@astrojs/svelte";

// https://astro.build/config
export default defineConfig({
  env: {
    schema: {
      BACKEND_URL: envField.string({ access: "public", context: "client" }),
    },
  },

  integrations: [svelte()],

  vite: {
    plugins: [tailwindcss()],
  },
});
