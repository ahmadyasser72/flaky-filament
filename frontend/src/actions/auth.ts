import type { AstroCookies } from "astro";
import { ActionError, defineAction } from "astro:actions";
import { z } from "astro/zod";

import { APIError } from "better-auth";
import { parseSetCookieHeader } from "better-auth/cookies";

const usernameSchema = z
	.string()
	.min(3, { message: "Username harus memiliki setidaknya 3 karakter" })
	.max(20, { message: "Username tidak boleh lebih dari 20 karakter" })
	.regex(/^[a-zA-Z0-9_]+$/, {
		message: "Username hanya boleh berisi huruf, angka, dan garis bawah (_)",
	});

const passwordSchema = z
	.string()
	.min(8, { message: "Kata sandi harus memiliki setidaknya 8 karakter" })
	.regex(/[0-9]/, {
		message: "Kata sandi harus mengandung setidaknya satu angka",
	});

const loginSchema = z.object({
	username: z.string(),
	password: z.string(),
});

const registerSchema = z.object({
	username: usernameSchema,
	password: passwordSchema,
});

export const auth = {
	login: defineAction({
		accept: "form",
		input: loginSchema,
		handler: async (user, { locals, cookies }) => {
			try {
				const { headers } = await locals.auth.api.signInUsername({
					body: user,
					returnHeaders: true,
				});

				setResponseCookies(headers, cookies);
			} catch (error) {
				if (error instanceof APIError) {
					throw new ActionError({
						code: "BAD_REQUEST",
						message: error.message,
					});
				}

				throw error;
			}
		},
	}),
	logout: defineAction({
		accept: "form",
		handler: async (_, { locals, cookies, request }) => {
			try {
				const { headers } = await locals.auth.api.signOut({
					headers: request.headers,
					returnHeaders: true,
				});

				setResponseCookies(headers, cookies);
			} catch (error) {
				if (error instanceof APIError) {
					throw new ActionError({
						code: "BAD_REQUEST",
						message: error.message,
					});
				}

				throw error;
			}
		},
	}),
	register: defineAction({
		accept: "form",
		input: registerSchema,
		handler: async (user, { locals, cookies }) => {
			try {
				const { headers } = await locals.auth.api.signUpEmail({
					body: {
						...user,
						email: `${user.username}@example.com`,
						name: user.username,
					},
					returnHeaders: true,
				});

				setResponseCookies(headers, cookies);
			} catch (error) {
				if (error instanceof APIError) {
					throw new ActionError({
						code: "BAD_REQUEST",
						message: error.message,
					});
				}

				throw error;
			}
		},
	}),
};

const setResponseCookies = (headers: Headers, cookies: AstroCookies) => {
	const setCookies = headers.get("set-cookie")!;
	const parsedCookies = parseSetCookieHeader(setCookies);
	for (const [key, cookie] of parsedCookies) {
		cookies.set(key, decodeURIComponent(cookie.value), {
			sameSite: cookie.samesite,
			secure: cookie.secure,
			maxAge: cookie["max-age"],
			httpOnly: cookie.httponly,
			domain: cookie.domain,
			path: cookie.path,
		});
	}
};
