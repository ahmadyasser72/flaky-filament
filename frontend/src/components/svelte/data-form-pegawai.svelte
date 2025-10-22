<script lang="ts">
  import DataForm from "./data-form.svelte";
  import FormField from "./form-field.svelte";
  import FormFieldRadio from "./form-field-radio.svelte";
</script>

<DataForm path="sekretariat.pegawai">
  {#snippet nomorIndukPegawai({ initialValue, error })}
    <FormField
      name="nomorIndukPegawai"
      label="Nomor Induk Pegawai (NIP)"
      type="text"
      {initialValue}
      {error}
    />
  {/snippet}
  {#snippet namaLengkap({ initialValue, error })}
    <FormField
      name="namaLengkap"
      label="Nama Lengkap"
      type="text"
      {initialValue}
      {error}
    />
  {/snippet}
  {#snippet tempatLahir({ initialValue, error })}
    <FormField
      name="tempatLahir"
      label="Tempat Lahir"
      type="text"
      {initialValue}
      {error}
    />
  {/snippet}
  {#snippet tanggalLahir({ initialValue, error })}
    <FormField
      name="tanggalLahir"
      label="Tanggal Lahir"
      type="date"
      {initialValue}
      {error}
    />
  {/snippet}
  {#snippet jenisKelamin({ initialValue, error })}
    <FormFieldRadio
      name="jenisKelamin"
      label="Jenis Kelamin"
      options={[
        { label: "Laki-laki", value: "L" },
        { label: "Perempuan", value: "P" },
      ]}
      selected={initialValue}
      {error}
    />
  {/snippet}
  {#snippet golonganDarah({ initialValue, error })}
    <FormFieldRadio
      name="golonganDarah"
      label="Golongan Darah"
      options={[
        { label: "A", value: "A" },
        { label: "B", value: "B" },
        { label: "AB", value: "AB" },
        { label: "O", value: "O" },
      ]}
      selected={initialValue}
      {error}
    />
  {/snippet}
</DataForm>
