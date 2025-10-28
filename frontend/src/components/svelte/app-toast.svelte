<script lang="ts" module>
	interface Flash {
		title: string;
		description: string;
		type: "success" | "info" | "warning" | "error";
		noonce: number;
	}

	const FLASH_EVENT = "toast:sonner";

	export const flash = (
		context: { response: ResponseInit & { readonly headers: Headers } },
		data: Omit<Flash, "noonce">,
	) => {
		context.response.headers.set(
			"x-up-events",
			JSON.stringify([
				{ type: FLASH_EVENT, data: { ...data, noonce: Date.now() } },
			]),
		);
	};

	export const flashRedirect = ({
		location,
		...data
	}: Omit<Flash, "noonce"> & { location: string }) => {
		const query = new URLSearchParams({
			_up_events: JSON.stringify([
				{ type: FLASH_EVENT, data: { ...data, noonce: Date.now() } },
			]),
		});

		return new Response(undefined, {
			status: 302,
			headers: { location: `${location}?${query}` },
		});
	};
</script>

<script lang="ts">
	import { onMount } from "svelte";
	import { toast, Toaster } from "svelte-sonner";
	import { on } from "svelte/events";
	import { MediaQuery } from "svelte/reactivity";

	import { mode } from "./app-theme.svelte";

	const isDesktop = new MediaQuery("(width > 1024px)");

	onMount(() => {
		const seen = new Set<number>();
		return on(document, FLASH_EVENT, (event) => {
			const { data } = event as Event & { data: Flash };
			if (!seen.has(data.noonce)) {
				seen.add(data.noonce);
				toast[data.type](data.title, { description: data.description });
			}
		});
	});
</script>

<Toaster
	richColors
	position={isDesktop.current ? "top-center" : "bottom-right"}
	theme={mode.current}
/>
