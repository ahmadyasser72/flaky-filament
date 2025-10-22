import { BACKEND_URL } from "astro:env/client";

import { createClient } from "backend";
import type { InferResponseType } from "hono";
import type { Get, Paths } from "type-fest";

const client = createClient(BACKEND_URL);

type Client = typeof client;
export type RPCPath = Paths<Client, { depth: 1 }>;
export type RPCDataType<P extends RPCPath> = InferResponseType<
	Get<Client, P>[":id"]["$get"]
>["data"];

export const getRPC = <Path extends RPCPath>(path: Path): Get<Client, Path> => {
	return path.split(".").reduce((o, key) => (o as never)[key], client) as never;
};
