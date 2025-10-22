import { defineConfig } from "drizzle-kit";

export default defineConfig({
	out: "./drizzle",
	schema: "./src/db/schema",
	casing: "snake_case",
	dialect: process.env.NODE_ENV === "development" ? "sqlite" : "turso",
	dbCredentials: {
		url: process.env.SQLITE_AUTH_TOKEN,
		authToken: process.env.SQLITE_AUTH_TOKEN,
	},
});
