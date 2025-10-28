import { randomBytes, scryptSync } from "node:crypto";

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin as adminPlugin, username } from "better-auth/plugins";

import { createDrizzle } from "~/db";
import { Env } from "~/factory";
import { ac, admin, user } from "./permissions";

export const createAuth = ({
	DB,
	SESSION_KV,
	BETTER_AUTH_SECRET,
}: Partial<
	Pick<Env["Bindings"], "DB" | "SESSION_KV" | "BETTER_AUTH_SECRET">
>) =>
	betterAuth({
		secret: BETTER_AUTH_SECRET,
		database: drizzleAdapter(DB ? createDrizzle(DB) : {}, {
			provider: "sqlite",
		}),
		secondaryStorage: SESSION_KV
			? {
					get: (key) => SESSION_KV.get(key),
					set: (key, value, ttl) =>
						SESSION_KV.put(key, value, { expirationTtl: ttl }),
					delete: (key) => SESSION_KV.delete(key),
				}
			: undefined,
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

export const auth = createAuth({});

export type Session = typeof auth.$Infer.Session;
