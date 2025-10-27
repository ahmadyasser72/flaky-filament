import { drizzle } from "drizzle-orm/d1";

import * as authSchema from "~/auth/schema";
import * as schema from "./schema";

export * from "./schema";

export const createDrizzle = (db: D1Database) =>
	drizzle(db, { casing: "snake_case", schema: { ...schema, ...authSchema } });
