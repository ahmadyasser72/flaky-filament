import type { APIRoute } from "astro";

export const ALL: APIRoute = ({ locals, request }) => {
	return locals.auth.handler(request);
};
