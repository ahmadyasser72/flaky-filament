import { integer } from "drizzle-orm/sqlite-core";

export const timestamps = {
	createdAt: integer({ mode: "timestamp" }).$defaultFn(() => new Date()),
	updatedAt: integer({ mode: "timestamp" }).$onUpdateFn(() => new Date()),
};
