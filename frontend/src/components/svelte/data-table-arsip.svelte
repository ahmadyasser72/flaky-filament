<script lang="ts">
	import { getRPC } from "~/rpc";
	import { formatDate } from "~/utils/date";
	import DataTable from "./data-table.svelte";

	const action = getRPC("sekretariat.arsip");
</script>

<DataTable
	path="sekretariat.arsip"
	columns={["judul", "tanggal", "file"]}
	headers={{ tanggal: () => "Tanggal Arsip" }}
>
	{#snippet judul({ value })}
		<p class="font-medium">{value}</p>
	{/snippet}
	{#snippet tanggal({ value })}
		<p>{formatDate(new Date(value))}</p>
	{/snippet}
	{#snippet file({ value, row })}
		{@const downloadUrl = action[":id"].file.$url({ param: { id: row.id } })}
		<a
			class="link inline-flex items-center gap-x-1"
			target="_blank"
			href={downloadUrl.href}
		>
			<span class="line-clamp-1">{value}</span>
			<iconify-icon icon="lucide:external-link" width="16"></iconify-icon>
		</a>
	{/snippet}
</DataTable>
