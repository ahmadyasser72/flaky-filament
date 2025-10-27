import { env } from "hono/adapter";
import { bearerAuth } from "hono/bearer-auth";
import { createFactory } from "hono/factory";

import { createDrizzle } from "~/db";

type Env = {
	Bindings: CloudflareBindings;
	Variables: {
		db: ReturnType<typeof createDrizzle>;
		createId: () => string;
	};
};

export const factory = createFactory<Env>({
	defaultAppOptions: { strict: true },
	initApp: (app) => {
		app.use(async (c, next) => {
			const { API_KEY } = env(c);
			const bearer = bearerAuth({ token: API_KEY });

			return bearer(c, next);
		});

		app.use(async (c, next) => {
			const db = createDrizzle(c.env.DB);
			c.set("db", db);

			const { init } = await import("@paralleldrive/cuid2");
			c.set("createId", init({ length: 8 }));

			await next();
		});
	},
});
