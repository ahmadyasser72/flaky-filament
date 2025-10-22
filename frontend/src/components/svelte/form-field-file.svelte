<script lang="ts">
  import prettyBytes from "pretty-bytes";

  interface Props {
    label: string;
    name: string;
    initialValue?: string;
    error?: string;
    class?: string;
  }

  const {
    label,
    name,
    initialValue,
    error,
    class: className,
  }: Props = $props();

  let fileDetail = $derived(initialValue ?? "");
  const handleFileInput = (event: Event) => {
    const fileInput = event.target;
    if (!(fileInput instanceof HTMLInputElement)) return;

    const file = fileInput.files![0];
    fileDetail = `(${prettyBytes(file.size)}) ${file.name}`;
  };
</script>

<input id={name} {name} type="file" class="hidden" oninput={handleFileInput} />
<div class={["flex flex-col gap-1 max-sm:min-h-40", className]}>
  <label for={name} class="label">{label}</label>
  <label
    for={name}
    class={[
      "input pointer-events-none flex-1 px-8 py-4 sm:py-6",
      initialValue === undefined && "*:pointer-events-auto",
      error !== undefined && "input-error",
    ]}
  >
    <div class="flex h-full flex-col w-full gap-y-2">
      <span
        class={[
          "btn btn-soft w-full flex-1",
          initialValue !== undefined && "btn-disabled",
        ]}>Pilih file</span
      >
      <span
        class={[
          "line-clamp-2 max-w-48 text-xs font-medium text-wrap break-all select-none sm:max-w-32",
          fileDetail === "" && "hidden",
        ]}>{fileDetail}</span
      >
    </div>
  </label>
  <p class={["text-error text-xs", error === undefined && "opacity-0"]}>
    {error ?? "-"}
  </p>
</div>
