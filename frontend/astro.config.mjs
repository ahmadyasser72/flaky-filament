// @ts-check
import { defineConfig, envField } from "astro/config";

import svelte from "@astrojs/svelte";
import tailwindcss from "@tailwindcss/vite";

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
