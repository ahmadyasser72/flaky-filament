type Runtime = import("@astrojs/cloudflare").Runtime<CloudflareBindings>;

declare namespace App {
	interface Locals extends Runtime {
		auth: typeof import("$lib/auth").auth;
		rpc: import("backend").Client & { fetch: typeof globalThis.fetch };

		user: import("$lib/auth").Session["user"] | null;
		session: import("$lib/auth").Session["session"] | null;
	}
}

interface ObjectConstructor {
	entries<T extends object>(o: T): Array<[keyof T, T[keyof T]]>;
	keys<T extends object>(o: T): Array<keyof T>;
}
