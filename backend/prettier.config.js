import baseConfig from "shared-prettier-config";

/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
	...baseConfig,

	plugins: ["@ianvs/prettier-plugin-sort-imports"],
	importOrder: [
		"^@?hono",
		"",
		"<THIRD_PARTY_MODULES>",
		"",
		"^~/(.*)$",
		"^[./]",
	],
};

export default config;
