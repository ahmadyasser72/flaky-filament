import { factory } from "~/factory";
import { app as arsip } from "./arsip";
import { app as pegawai } from "./pegawai";

export const app = factory
	.createApp()
	.use(async (c, next) => {
		if (!c.var.user) return c.json({ error: "Unauthorized" }, 401);

		const { success: allowed } = await c.var.auth.api.userHasPermission({
			body: {
				userId: c.var.user.id,
				permission: {
					sekretariat: [
						["POST", "PATCH", "PUT", "DELETE"].includes(c.req.method)
							? "write"
							: "read",
					],
				},
			},
		});
		if (!allowed) return c.json({ error: "Unauthorized" }, 401);

		await next();
	})
	.route("/arsip", arsip)
	.route("/pegawai", pegawai);
