<script
  lang="ts"
  generics="
    Path extends RPCPath,
    Columns extends keyof Omit<NonNullable<RPCDataType<Path>>, 'id' | 'createdAt' | 'updatedAt'> & string
  "
>
  import { type Snippet } from "svelte";
  import { toast } from "svelte-sonner";
  import { titleCase } from "text-case";
  import type { Split } from "type-fest";

  import { type RPCPath, type RPCDataType, getRPC } from "~/rpc";

  type DataType = NonNullable<RPCDataType<Path>>;
  type Headers = {
    [K in Columns]?: (columnName: K) => string;
  };
  type Snippets = {
    [K in Columns]?: Snippet<[{ value: DataType[K]; row: DataType }]>;
  };

  type Props = {
    path: Path;
    columns: Columns[];
    headers: Headers;
  } & Snippets;

  const { path, columns, headers, ..._snippets }: Props = $props();
  const action = $derived(getRPC(path));
  const name = $derived((path.split(".") as Split<Path, ".">)[1]);
  const snippets = $derived(_snippets as unknown as Snippets);

  const fetchDataList = async () => {
    const response = await action.$get();
    if (response.ok) return (await response.json()).data as DataType[];
    else return [];
  };

  const dataList = $state(await fetchDataList());

  let deleteModal = $state<HTMLDialogElement>();
  let selectedDataForDeletion = $state<DataType>();
  const handleDelete = async () => {
    if (selectedDataForDeletion === undefined) return;

    const response = await action[":id"].$delete({
      param: { id: selectedDataForDeletion.id },
    });

    if (response.ok) {
      const { data } = await response.json();

      const deletedIdx = dataList.findIndex(({ id }) => data.id === id);
      if (deletedIdx !== -1) dataList.splice(deletedIdx, 1);

      toast.success(`Berhasil menghapus ${name}!`, {
        description: `ID: ${data.id}`,
      });
    }

    deleteModal!.close();
  };
</script>

<div class="flex max-h-[80vh] flex-col">
  <div class="mb-4 flex gap-x-2 justify-self-start">
    <a href="/crud/{path}/form" class="btn btn-primary">
      Tambah {name}
    </a>
  </div>

  <div class="rounded-box flex-1 overflow-auto shadow-sm">
    <table class="table-sm table">
      <thead>
        <tr class="bg-base-300 sticky top-0 z-10">
          <th class="sticky left-0 w-8 bg-inherit">No. </th>

          {#each columns as column (column)}
            {@const header = headers[column]}
            <th>
              {header?.(column) ?? titleCase(column)}
            </th>
          {/each}

          <th></th>
        </tr>
      </thead>

      <tbody>
        {#each dataList as row, idx (row.id)}
          <tr class="odd:bg-base-100 even:bg-base-200 hover:bg-base-300">
            <th class="sticky left-0 bg-inherit">{idx + 1}</th>

            {#each columns as column (column)}
              {@const value = row[column as never]}
              {@const snippet = snippets[column]}

              <td>
                {#if snippet !== undefined}
                  {@render snippet({ value, row })}
                {:else}
                  {value}
                {/if}
              </td>
            {/each}

            <td class="sticky right-0 bg-inherit max-lg:static">
              <div class="flex gap-x-2">
                <a
                  href="/crud/{path}/form?edit={row.id}"
                  class="btn btn-xs btn-warning edit-button"
                >
                  Edit
                </a>
                <button
                  onclick={() => {
                    selectedDataForDeletion = row;
                    deleteModal!.showModal();
                  }}
                  class="btn btn-xs btn-error delete-button"
                >
                  Hapus
                </button>
              </div>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

<dialog bind:this={deleteModal} class="modal max-sm:modal-bottom">
  <div class="modal-box">
    <h3 class="text-lg font-bold">Hapus {name} ini?</h3>
    {#if selectedDataForDeletion}
      <div class="py-4 grid grid-cols-4 gap-y-2 text-sm">
        <span class="font-medium">ID</span>
        <span class="font-medium col-span-3">{selectedDataForDeletion.id}</span>
        {#each columns as column}
          {@const key = column as never}
          <span>{titleCase(key)}</span>
          <span class="text-wrap break-all line-clamp-2 col-span-3 underline"
            >{selectedDataForDeletion[key]}</span
          >
        {/each}
      </div>
    {/if}
    <div class="modal-action">
      <form method="dialog">
        <button class="btn btn-outline"> Batal </button>
      </form>

      <button onclick={handleDelete} class="btn btn-error">Hapus</button>
    </div>
  </div>

  <form method="dialog" class="modal-backdrop">
    <button> close </button>
  </form>
</dialog>
