import type { APIRoute } from "astro";
import { actions } from "astro:actions";

export const GET: APIRoute = async ({ params, callAction }) => {
  const arsip = await callAction(actions.arsip.read.orThrow, {
    id: params.id!,
  });

  if (arsip === undefined) return new Response("NOT FOUND", { status: 404 });
  else
    return new Response(arsip.fileBuffer, {
      headers: {
        "content-disposition": `attachment; filename="${arsip.fileName}"`,
      },
    });
};
