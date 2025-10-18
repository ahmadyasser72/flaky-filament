import { column, sql } from "astro:db";

export const timestamps = {
  createdAt: column.date({ default: sql`CURRENT_TIMESTAMP` }),
  updatedAt: column.date({ optional: true }),
};
