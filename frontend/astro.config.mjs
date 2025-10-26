// @ts-check
import { defineConfig, envField } from "astro/config";

import cloudflare from "@astrojs/cloudflare";
import svelte from "@astrojs/svelte";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
	output: "server",
	adapter: cloudflare({ imageService: "passthrough" }),

	env: {
		schema: {
			BACKEND_URL: envField.string({
				access: "public",
				context: "server",
				url: true,
			}),
			BACKEND_API_KEY: envField.string({ access: "secret", context: "server" }),
		},
	},

	integrations: [svelte()],

	vite: {
		plugins: [tailwindcss()],
		server: { hmr: false },
	},
	devToolbar: { enabled: false },
});
