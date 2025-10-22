import { zValidator as zv } from "@hono/zod-validator";
import type { ValidationTargets } from "hono";

import { flattenError, ZodObject } from "zod";

export const zValidator = <
	T extends ZodObject,
	Target extends keyof ValidationTargets,
>(
	target: Target,
	schema: T,
) =>
	zv(target, schema, (result, c) => {
		if (!result.success) {
			return c.json({ errors: flattenError(result.error).fieldErrors }, 422);
		}
	});
