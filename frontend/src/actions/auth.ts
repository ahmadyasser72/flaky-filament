import type { AstroCookies } from "astro";
import { ActionError, defineAction } from "astro:actions";
import { z } from "astro/zod";

import type { InferResponseType } from "hono/client";

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
			const response = await locals.backend.rpc.auth.login.$post({
				json: user,
			});

			if (response.ok) {
				const { data } = await response.json();
				setResponseCookies(data, cookies);
			} else {
				const { message } = await response.json();
				throw new ActionError({ code: "BAD_REQUEST", message });
			}
		},
	}),
	logout: defineAction({
		accept: "form",
		handler: async (_, { locals, cookies }) => {
			const response = await locals.backend.rpc.auth.logout.$post();

			if (response.ok) {
				const { data } = await response.json();
				setResponseCookies(data, cookies);
			} else {
				const { message } = await response.json();
				throw new ActionError({ code: "BAD_REQUEST", message });
			}
		},
	}),
	register: defineAction({
		accept: "form",
		input: registerSchema,
		handler: async (user, { locals, cookies }) => {
			const response = await locals.backend.rpc.auth.register.$post({
				json: user,
			});

			if (response.status === 200) {
				const { data } = await response.json();
				setResponseCookies(data, cookies);
			} else {
				const { message } = await response.json();
				throw new ActionError({ code: "BAD_REQUEST", message });
			}
		},
	}),
};

const setResponseCookies = (
	cookies: NonNullable<
		InferResponseType<
			App.Locals["backend"]["rpc"]["auth"]["login"]["$post"]
		>["data"]
	>,
	cookieHelper: AstroCookies,
) => {
	for (const key in cookies) {
		const { value, ...options } = cookies[key];
		cookieHelper.set(key, value, options);
	}
};
