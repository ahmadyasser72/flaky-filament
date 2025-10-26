import { getActionContext } from "astro:actions";
import { BACKEND_URL } from "astro:env/server";
import { defineMiddleware, sequence } from "astro:middleware";

import { createAuth } from "$lib/auth";
import { createClient } from "backend";

import { createDrizzle } from "./lib/auth/db";

const initializeAuth = defineMiddleware(async ({ locals, request }, next) => {
	const db = createDrizzle(locals.runtime.env.AUTH_DB);
	locals.auth = createAuth(db);

	const isAuthed = await locals.auth.api.getSession({
		headers: request.headers,
	});

	if (isAuthed) {
		locals.user = isAuthed.user;
		locals.session = isAuthed.session;
	} else {
		locals.user = null;
		locals.session = null;
	}

	return next();
});

const handleLogout = defineMiddleware(async (context, next) => {
	const { action, setActionResult, serializeActionResult } =
		getActionContext(context);

	if (action?.name === "auth.logout") {
		const result = await action.handler();
		if (!result.error) return context.redirect("/auth");
		setActionResult(action.name, serializeActionResult(result));
	}

	return next();
});

const protectAllRoutes = defineMiddleware(
	async ({ locals, url, redirect }, next) =>
		!locals.session && url.pathname !== "/auth" ? redirect("/auth") : next(),
);

const initializeBackendRpc = defineMiddleware(({ locals }, next) => {
	const bearerHeaders = {
		authorization: `Bearer ${locals.runtime.env.BACKEND_API_KEY}`,
	};

	locals.rpc = {
		...createClient(BACKEND_URL, { headers: bearerHeaders }),
		fetch: (input, init) =>
			fetch(input, {
				...init,
				headers: { ...bearerHeaders, ...init?.headers },
			}),
	};

	return next();
});

export const onRequest = sequence(
	initializeAuth,
	handleLogout,
	protectAllRoutes,
	initializeBackendRpc,
);
