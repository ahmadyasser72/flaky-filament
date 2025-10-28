<script lang="ts" module>
	interface Flash {
		title: string;
		description: string;
		type: "success" | "info" | "warning" | "error";
	}

	const FLASH_EVENT = "toast:sonner";

	export const flash = (
		context: { response: ResponseInit & { readonly headers: Headers } },
		data: Flash,
	) => {
		context.response.headers.set(
			"x-up-events",
			JSON.stringify([{ type: FLASH_EVENT, data }]),
		);
	};
</script>

<script lang="ts">
	import { onMount } from "svelte";
	import { toast, Toaster } from "svelte-sonner";
	import { on } from "svelte/events";
	import { MediaQuery } from "svelte/reactivity";

	import { mode } from "./app-theme.svelte";

	const isDesktop = new MediaQuery("(width > 1024px)");

	onMount(() =>
		on(document, FLASH_EVENT, (event) => {
			const { data } = event as Event & { data: Flash };
			toast[data.type](data.title, { description: data.description });
		}),
	);
</script>

<Toaster
	richColors
	position={isDesktop.current ? "top-center" : "bottom-right"}
	theme={mode.current}
/>
