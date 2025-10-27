import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ params, locals }) => {
	const id = params.id!;
	const response = await locals.backend.rpc.sekretariat.arsip[":id"].file.$get({
		param: { id },
	});

	return new Response(response.body, { headers: response.headers });
};
