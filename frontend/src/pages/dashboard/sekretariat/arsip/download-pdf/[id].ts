import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ params, locals }) => {
	const id = params.id!;
	return locals.backend.rpc.sekretariat.arsip[":id"].file.$get({
		param: { id },
	});
};
