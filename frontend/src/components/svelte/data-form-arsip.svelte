<script lang="ts">
	import DataForm from "./data-form.svelte";
	import FormFieldFile from "./form-field-file.svelte";
	import FormField from "./form-field.svelte";
</script>

<DataForm path="sekretariat.arsip">
	{#snippet judul({ initialValue, error })}
		<FormField name="judul" label="Judul" type="text" {initialValue} {error} />
	{/snippet}
	{#snippet file({ initialValue, error })}
		<FormFieldFile
			name="file"
			label="File Arsip (PDF, max 10MB)"
			class="row-span-2 max-sm:row-start-3"
			{initialValue}
			{error}
		/>
	{/snippet}
	{#snippet tanggal({ initialValue, error })}
		<FormField
			name="tanggal"
			label="Tanggal"
			type="date"
			initialValue={initialValue ?? new Date().toISOString()}
			{error}
		/>
	{/snippet}
</DataForm>
