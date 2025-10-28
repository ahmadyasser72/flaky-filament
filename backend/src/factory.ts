import { createFactory } from "hono/factory";

import { createAuth, Session } from "~/auth";
import { createDrizzle } from "~/db";

export type Env = {
	Bindings: CloudflareBindings;
	Variables: {
		db: ReturnType<typeof createDrizzle>;
		auth: ReturnType<typeof createAuth>;

		user: Session["user"] | null;
		session: Session["session"] | null;

		createId: () => string;
	};
};

export const factory = createFactory<Env>({
	defaultAppOptions: { strict: true },
	initApp: (app) => {
		app.use(async (c, next) => {
			const db = createDrizzle(c.env.DB);
			c.set("db", db);
			const auth = createAuth(c.env);
			c.set("auth", auth);

			const { init } = await import("@paralleldrive/cuid2");
			c.set("createId", init({ length: 8 }));

			await next();
		});

		app.use("*", async (c, next) => {
			const session = await c.var.auth.api.getSession({
				headers: c.req.raw.headers,
			});

			if (!session) {
				c.set("user", null);
				c.set("session", null);
			} else {
				c.set("user", session.user);
				c.set("session", session.session);
			}

			await next();
		});
		app.on(["POST", "GET"], "/api/auth/*", (c) =>
			c.var.auth.handler(c.req.raw),
		);
	},
});
