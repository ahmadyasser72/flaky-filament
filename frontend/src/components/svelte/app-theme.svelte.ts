import { persistedState } from "svelte-persisted-state";
import { MediaQuery } from "svelte/reactivity";

type Mode = "light" | "dark";
type Theme = "cupcake" | "dim";

const systemPrefersDark = new MediaQuery("(prefers-color-scheme: dark)");
export const mode = persistedState<Mode>(
	"app-mode",
	systemPrefersDark.current ? "dark" : "light",
);

const themeMap: Record<Mode, Theme> = { light: "cupcake", dark: "dim" };
const theme = $derived(themeMap[mode.current]);

$effect.root(() => {
	$effect(() => {
		mode.current = systemPrefersDark.current ? "dark" : "light";
	});
	$effect(() => {
		document.documentElement.dataset.theme = theme;
	});
});
