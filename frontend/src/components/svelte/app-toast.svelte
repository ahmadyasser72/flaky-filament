<script lang="ts">
	import { Toaster } from "svelte-sonner";
	import { MediaQuery } from "svelte/reactivity";

	import { mode } from "./app-theme.svelte";

	const isDesktop = new MediaQuery("(min-width: 1024px)");
</script>

<Toaster
	richColors
	theme={mode.current}
	duration={5000}
	position={isDesktop.current ? "top-center" : "bottom-right"}
/>
