<script lang="ts">
  import type { JSX } from "astro/jsx-runtime";
  import { formatDate } from "~/utils/date";

  interface Props {
    label: string;
    name: string;
    type: JSX.HTMLInputTypeAttribute;
    initialValue?: string;
    error?: string;
  }

  const { name, label, type, initialValue, error }: Props = $props();
  const value = $derived(
    type === "date" && initialValue
      ? formatDate(new Date(initialValue))
      : initialValue,
  );
</script>

<div class="flex flex-col gap-1">
  <label for={name} class="label">{label}</label>
  <input
    id={name}
    {name}
    {type}
    class={["input", error !== undefined && "input-error"]}
    {value}
  />
  <p class={["text-error text-xs", error === undefined && "opacity-0"]}>
    {error ?? "-"}
  </p>
</div>
