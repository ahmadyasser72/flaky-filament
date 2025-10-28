import { getActionContext } from "astro:actions";
import { defineMiddleware, sequence } from "astro:middleware";

import { createClient } from "backend";

const initializeBackendRpc = defineMiddleware(({ locals, request }, next) => {
	const { BACKEND } = locals.runtime.env;

	const fetch: typeof BACKEND.fetch = (input, init) => {
		init ??= {};

		const hasContentType = new Headers(init.headers).has("content-type");
		// @ts-expect-error keep winning
		if (init.body && !hasContentType) init.duplex = "half";

		init.headers = new Headers([
			...request.headers
				.entries()
				.filter(([key]) => key === "cookie" || !hasContentType),
			...new Headers(init.headers).entries(),
		]);

		return BACKEND.fetch(input, init);
	};

	locals.backend = {
		fetch,
		rpc: createClient("http://internal-backend", { fetch: fetch }),
	};

	return next();
});

const initializeSession = defineMiddleware(async ({ locals }, next) => {
	const response = await locals.backend.rpc.auth.session.$get();
	const { data } = await response.json();
	locals.user = data?.user;
	locals.session = data?.user;

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

// https://github.com/unpoly/unpoly/discussions/514#discussioncomment-6446551
const handleUnPolyQueryEvents = defineMiddleware(async ({ url }, next) => {
	const response = await next();

	const strippedUrl = new URL(url);
	const upEvents = strippedUrl.searchParams.get("_up_events");
	if (upEvents) {
		strippedUrl.searchParams.delete("_up_events");
		response.headers.set("x-up-events", upEvents);
		response.headers.set("x-up-location", strippedUrl.href);
	}

	return response;
});

export const onRequest = sequence(
	initializeBackendRpc,
	initializeSession,
	handleLogout,
	protectAllRoutes,
	handleUnPolyQueryEvents,
);
