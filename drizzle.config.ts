import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/server/db/schema",
  casing: "snake_case",
  dialect: "sqlite",
  dbCredentials: {
    url: "file:local.db",
  },
});
