import { randomBytes, scryptSync } from "node:crypto";

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin as adminPlugin, username } from "better-auth/plugins";

import type { createDrizzle } from "~/db";
import { ac, admin, user } from "./permissions";

export const createAuth = (
	db?: ReturnType<typeof createDrizzle>,
	secret?: string,
) =>
	betterAuth({
		secret,
		database: drizzleAdapter(db ?? {}, { provider: "sqlite" }),
		emailAndPassword: {
			enabled: true,
			password: {
				hash: async (password) => {
					const salt = randomBytes(16).toString("hex");
					const key = scryptSync(password, salt, 64).toString("hex");
					return `${salt}:${key}`;
				},
				verify: async ({ hash, password }) => {
					const [salt, key] = hash.split(":");
					return key === scryptSync(password, salt, 64).toString("hex");
				},
			},
			// disableSignUp: isProduction,
		},

		plugins: [
			adminPlugin({
				ac,
				roles: { admin, user },
				adminRoles: "admin",
				// defaultRole: isProduction ? "user" : "admin",
			}),
			username(),
		],
	});

export const auth = createAuth();

export type Session = typeof auth.$Infer.Session;
