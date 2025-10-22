import baseConfig from "shared-prettier-config";

/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
	...baseConfig,

	plugins: [
		"prettier-plugin-astro",
		"prettier-plugin-svelte",
		"prettier-plugin-tailwindcss",
		"@ianvs/prettier-plugin-sort-imports",
	],
	overrides: [
		{ files: "*.astro", options: { parser: "astro" } },
		{ files: "*.svelte", options: { parser: "svelte" } },
	],
	importOrder: ["^astro", "", "<THIRD_PARTY_MODULES>", "", "^~/(.*)$", "^[./]"],
};

export default config;
