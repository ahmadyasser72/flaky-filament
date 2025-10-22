import { drizzle } from "drizzle-orm/libsql";

import * as schema from "./schema";
export * from "./schema";

export const createDrizzle = (url: string, authToken?: string) =>
  drizzle({
    connection: { url, authToken },
    casing: "snake_case",
    schema,
  });
