import { drizzle } from "drizzle-orm/libsql";

import * as schema from "./schema";
export * from "./schema";

export const db = drizzle({
  connection: { url: "file:local.db" },
  casing: "snake_case",
  schema,
});
