import { untrack } from "svelte";
import { persistedState } from "svelte-persisted-state";
import { MediaQuery } from "svelte/reactivity";

type Mode = "light" | "dark";
type Theme = "cupcake" | "dim";

const systemPrefersDark = new MediaQuery("(prefers-color-scheme: dark)");
const systemMode = $derived<Mode>(systemPrefersDark.current ? "dark" : "light");
export const mode = persistedState<Mode>(
	"app-mode",
	untrack(() => systemMode),
);

const themeMap: Record<Mode, Theme> = { light: "cupcake", dark: "dim" };
const theme = $derived(themeMap[mode.current]);

let firstCheck = $state(true);
$effect.root(() => {
	$effect(() => {
		systemMode;

		// noop to use locally stored mode on first check
		if (firstCheck) {
			firstCheck = false;
			return;
		}

		mode.current = systemMode;
	});

	$effect(() => {
		document.documentElement.dataset.theme = theme;
	});
});
