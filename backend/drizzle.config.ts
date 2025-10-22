import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema",
  casing: "snake_case",
  dialect: "turso",
  dbCredentials: {
    url: process.env.SQLITE_DATABASE_URL!,
    authToken: process.env.SQLITE_AUTH_TOKEN!,
  },
});
