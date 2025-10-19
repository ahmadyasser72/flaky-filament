import { column, defineTable } from "astro:db";
import { timestamps } from "./timestamp";

export const Pegawai = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    nomorIndukPegawai: column.text({ unique: true }),
    namaLengkap: column.text(),
    tempatLahir: column.text(),
    tanggalLahir: column.date(),
    jenisKelamin: column.text({ enum: ["L", "P"] }),
    golonganDarah: column.text({ enum: ["A", "B", "AB", "O"] }),
    ...timestamps,
  },
});

export const Arsip = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    judul: column.text(),
    tanggal: column.date(),
    file: column.text(),
    ...timestamps,
  },
});
