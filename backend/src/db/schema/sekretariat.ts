import { sqliteTable, integer, text, blob } from "drizzle-orm/sqlite-core";

import { timestamps } from "./timestamp";

export const Arsip = sqliteTable("arsip", {
  id: text().primaryKey(),
  judul: text().notNull(),
  tanggal: integer({ mode: "timestamp" }).notNull(),
  file: text().notNull(),
  fileBuffer: blob().$type<ArrayBuffer>().notNull(),
  ...timestamps,
});

export const Pegawai = sqliteTable("pegawai", {
  id: text().primaryKey(),
  nomorIndukPegawai: text().unique().notNull(),
  namaLengkap: text().notNull(),
  tempatLahir: text().notNull(),
  tanggalLahir: integer({ mode: "timestamp" }).notNull(),
  jenisKelamin: text({ enum: ["L", "P"] }).notNull(),
  golonganDarah: text({ enum: ["A", "B", "AB", "O"] }).notNull(),
  ...timestamps,
});
