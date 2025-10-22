import { env } from "hono/adapter";
import { cors } from "hono/cors";
import { createFactory } from "hono/factory";

import { createDrizzle } from "~/db";

type Env = {
  Bindings: Cloudflare.Env;
  Variables: {
    db: ReturnType<typeof createDrizzle>;
    createId: () => string;
  };
};

export const factory = createFactory<Env>({
  defaultAppOptions: { strict: true },
  initApp: (app) => {
    app.use(async (c, next) => {
      const { FRONTEND_URL } = env(c);
      const corsMiddleware = cors({
        origin: FRONTEND_URL,
        allowMethods: ["POST", "GET", "PUT", "DELETE"],
      });

      return corsMiddleware(c, next);
    });

    app.use(async (c, next) => {
      const { SQLITE_DATABASE_URL, SQLITE_AUTH_TOKEN } = env(c);
      const db = createDrizzle(SQLITE_DATABASE_URL, SQLITE_AUTH_TOKEN);
      c.set("db", db);

      const { createId } = await import("@paralleldrive/cuid2");
      c.set("createId", createId);

      await next();
    });
  },
});
