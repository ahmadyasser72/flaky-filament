import { app as authApp } from "~/auth/app";
import { app as sekretariatApp } from "~/crud/sekretariat/app";
import { factory } from "~/factory";

const app = factory.createApp();

const routes = app
	.route("/auth", authApp)
	.route("/sekretariat", sekretariatApp);

export default app;
export type AppType = typeof routes;
