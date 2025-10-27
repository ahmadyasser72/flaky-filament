import { defineConfig } from "drizzle-kit";

export default defineConfig({
	out: "./drizzle",
	schema: ["./src/db/schema", "./src/auth/schema.ts"],
	casing: "snake_case",
	dialect: "sqlite",
});
