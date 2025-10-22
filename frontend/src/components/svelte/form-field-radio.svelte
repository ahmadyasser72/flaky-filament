<script lang="ts">
  interface Props {
    label: string;
    name: string;
    options: Record<"label" | "value", string>[];
    selected?: string;
    error?: string;
  }

  const { label, name, options, selected, error }: Props = $props();
</script>

<fieldset id={name} class="fieldset">
  <legend class="label">{label}</legend>

  <div class="flex flex-wrap gap-x-4 gap-y-2">
    {#each options as { label, value } (value)}
      <label for={`${name}-${value}`} class="label">
        <input
          id={`${name}-${value}`}
          type="radio"
          {name}
          {value}
          checked={value === selected}
        />
        {label}
      </label>
    {/each}
  </div>

  <p class={["text-error text-xs", error === undefined && "opacity-0"]}>
    {error ?? "-"}
  </p>
</fieldset>
