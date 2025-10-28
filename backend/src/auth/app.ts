import { APIError } from "better-auth/api";
import { parseSetCookieHeader } from "better-auth/cookies";
import z from "zod";

import { zValidator } from "~/crud/validator";
import { factory } from "~/factory";

const schema = z.object({
	username: z.string(),
	password: z.string(),
});

export const app = factory
	.createApp()
	.get("/session", (c) => {
		const session = c.get("session");
		const user = c.get("user");

		if (!user || !session) return c.json({ data: null }, 401);

		return c.json({ data: { session, user } });
	})
	.post("/login", zValidator("json", schema), async (c) => {
		try {
			const user = c.req.valid("json");
			const { headers } = await c.var.auth.api.signInUsername({
				body: user,
				returnHeaders: true,
			});

			return c.json({ data: cookiesFromHeaders(headers) }, 200);
		} catch (error) {
			if (error instanceof APIError) {
				return c.json({ data: null, message: error.message }, 401);
			}

			throw error;
		}
	})
	.post("/logout", async (c) => {
		try {
			const { headers } = await c.var.auth.api.signOut({
				headers: c.req.raw.headers,
				returnHeaders: true,
			});

			return c.json({ data: cookiesFromHeaders(headers) }, 200);
		} catch (error) {
			if (error instanceof APIError) {
				return c.json({ data: null, message: error.message }, 401);
			}

			throw error;
		}
	})
	.post("/register", zValidator("json", schema), async (c) => {
		try {
			const user = c.req.valid("json");
			const { headers } = await c.var.auth.api.signUpEmail({
				body: {
					...user,
					email: `${user.username}@example.com`,
					name: user.username,
				},
				returnHeaders: true,
			});

			return c.json({ data: cookiesFromHeaders(headers) }, 200);
		} catch (error) {
			if (error instanceof APIError) {
				return c.json({ data: null, message: error.message }, 401);
			}

			throw error;
		}
	});

const cookiesFromHeaders = (headers: Headers) => {
	const setCookies = headers.get("set-cookie")!;
	const parsedCookies = parseSetCookieHeader(setCookies);
	return Object.fromEntries(
		parsedCookies.entries().map(([key, cookie]) => [
			key,
			{
				value: decodeURIComponent(cookie.value),
				sameSite: cookie.samesite,
				secure: cookie.secure,
				maxAge: cookie["max-age"],
				httpOnly: cookie.httponly,
				domain: cookie.domain,
				path: cookie.path,
			},
		]),
	);
};
