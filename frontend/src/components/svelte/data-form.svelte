<script lang="ts" generics="Path extends RPCPath">
	import { navigate } from "astro:transitions/client";

	import { onMount, type Snippet } from "svelte";
	import { toast } from "svelte-sonner";
	import type { Split } from "type-fest";

	import { getRPC, type RPCDataType, type RPCPath } from "~/rpc";

	type DataType = NonNullable<RPCDataType<Path>>;
	type Columns = keyof Omit<DataType, "id" | "createdAt" | "updatedAt">;

	type Fields = {
		[K in Columns]?: Snippet<
			[
				{
					initialValue?: DataType[K];
					error?: string;
				},
			]
		>;
	};

	type Props = {
		path: Path;
	} & Fields;

	const { path, ..._fields }: Props = $props();
	const action = $derived(getRPC(path));
	const name = $derived((path.split(".") as Split<Path, ".">)[1]);
	const fields = $derived(_fields as unknown as Fields);

	let data = $state<Partial<DataType>>({});
	onMount(async () => {
		const id = new URL(document.URL).searchParams.get("edit");
		if (!id) return;

		const response = await action[":id"].$get({ param: { id } });
		if (response.ok) data = (await response.json()).data;
	});

	let submitting = $state(false);
	let errors = $state<Partial<Record<Columns, string[]>>>({});
	const handleSubmit = async (event: SubmitEvent) => {
		event.preventDefault();

		submitting = true;
		const formElement = event.target as HTMLFormElement;
		const form = Object.fromEntries(new FormData(formElement)) as never;

		const isUpdate = data.id !== undefined;
		const response = await (!data.id
			? action.$post({ form })
			: action[":id"].$put({
					form,
					param: { id: data.id },
				}));

		if (response.ok) {
			const { data } = await response.json();

			toast.success(
				`Berhasil ${isUpdate ? "memperbarui" : "membuat"} ${name}!`,
				{
					description: `ID: ${data.id}`,
					onAutoClose: () => navigate(`/crud/${path}`),
				},
			);
		} else if (response.status === 422) {
			const json = await response.json();
			// @ts-expect-error trust me
			errors = json.errors;
			submitting = false;
		}
	};
</script>

<form
	onsubmit={handleSubmit}
	class={["mx-auto grid max-w-lg", submitting && "pointer-events-none"]}
>
	<fieldset
		class="fieldset bg-base-200 border-base-300 rounded-box grid gap-x-8 gap-y-2 border p-4 sm:grid-cols-2"
	>
		<legend class="fieldset-legend">Data {name}</legend>

		{#each Object.entries(fields) as [key, snippet]}
			{@render snippet?.({
				initialValue: data[key],
				error: errors[key]?.at(0),
			})}
		{/each}
	</fieldset>

	<div class="mt-4 flex gap-x-2 justify-self-end">
		<button
			onclick={(event) => {
				event.preventDefault();
				window.history.back();
			}}
			class="btn btn-outline"
		>
			Kembali
		</button>
		<button type="submit" class="btn btn-primary"> Simpan </button>
	</div>
</form>
