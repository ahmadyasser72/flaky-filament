import arsip from "~/crud/sekretariat/arsip";
import pegawai from "~/crud/sekretariat/pegawai";
import { factory } from "~/factory";

const app = factory.createApp();

const routes = app
	.route("/sekretariat/arsip", arsip)
	.route("/sekretariat/pegawai", pegawai);

export default app;
export type AppType = typeof routes;
