import { betterAuth, isProduction } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin as adminPlugin, username } from "better-auth/plugins";

import type { createDrizzle } from "./db";
import { ac, admin, user } from "./permissions";

export const createAuth = (db?: ReturnType<typeof createDrizzle>) =>
	betterAuth({
		database: drizzleAdapter(db ?? {}, { provider: "sqlite" }),
		emailAndPassword: {
			enabled: true,
			disableSignUp: isProduction,
		},

		plugins: [
			adminPlugin({
				ac,
				roles: { admin, user },
				adminRoles: "admin",
				defaultRole: isProduction ? "user" : "admin",
			}),
			username(),
		],
	});

export const auth = createAuth();

export type Session = typeof auth.$Infer.Session;
