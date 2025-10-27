import authRouter from "~/auth/app";
import arsipRouter from "~/crud/sekretariat/arsip";
import pegawaiRouter from "~/crud/sekretariat/pegawai";
import { factory } from "~/factory";

const app = factory.createApp();

const routes = app
	.route("/auth", authRouter)
	.route("/sekretariat/arsip", arsipRouter)
	.route("/sekretariat/pegawai", pegawaiRouter);

export default app;
export type AppType = typeof routes;
