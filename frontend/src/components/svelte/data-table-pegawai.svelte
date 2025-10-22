<script lang="ts">
  import { formatDate } from "~/utils/date";
  import DataTable from "./data-table.svelte";

  const jenisKelaminMap = {
    L: "Laki-laki",
    P: "Perempuan",
  };
</script>

<DataTable
  path="sekretariat.pegawai"
  columns={[
    "nomorIndukPegawai",
    "namaLengkap",
    "tempatLahir",
    "tanggalLahir",
    "jenisKelamin",
    "golonganDarah",
  ]}
  headers={{}}
>
  {#snippet tanggalLahir({ value })}
    {formatDate(new Date(value))}
  {/snippet}
  {#snippet jenisKelamin({ value })}
    {jenisKelaminMap[value]}
  {/snippet}
</DataTable>
