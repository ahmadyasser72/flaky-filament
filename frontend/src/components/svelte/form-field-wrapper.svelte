<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    error?: string;
    children: Snippet<
      [
        {
          inputClass: string | false;
          errorSnippet: Snippet;
          onblur: () => void;
          oninput: () => void;
        },
      ]
    >;
  }

  const { children, error }: Props = $props();

  let inputClass = $derived(error !== undefined && "input-error");
  let displayedError = $derived(error);
</script>

{#snippet errorSnippet()}
  <p
    class={["text-error text-xs", displayedError === undefined && "opacity-0"]}
  >
    {displayedError ?? "-"}
  </p>
{/snippet}

{@render children({
  inputClass,
  errorSnippet,
  oninput: () => {
    inputClass = false;
  },
  onblur: () => {
    if (!inputClass) displayedError = undefined;
  },
})}
