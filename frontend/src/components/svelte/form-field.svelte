<script lang="ts">
  import type { JSX } from "astro/jsx-runtime";
  import { formatDate } from "~/utils/date";
  import FormFieldWrapper from "./form-field-wrapper.svelte";

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

<FormFieldWrapper {error}>
  {#snippet children({ inputClass, errorSnippet, ...handler })}
    <div class="flex flex-col gap-1">
      <label for={name} class="label">{label}</label>
      <input
        id={name}
        {name}
        {type}
        {value}
        class={["input", inputClass]}
        {...handler}
      />

      {@render errorSnippet()}
    </div>
  {/snippet}
</FormFieldWrapper>
