import { sqliteTable, integer, text, blob } from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";

import { timestamps } from "./timestamp";

export const Pegawai = sqliteTable("pegawai", {
  id: text()
    .primaryKey()
    .$defaultFn(() => createId()),
  nomorIndukPegawai: text().unique().notNull(),
  namaLengkap: text().notNull(),
  tempatLahir: text().notNull(),
  tanggalLahir: integer({ mode: "timestamp" }).notNull(),
  jenisKelamin: text({ enum: ["L", "P"] }).notNull(),
  golonganDarah: text({ enum: ["A", "B", "AB", "O"] }).notNull(),
  ...timestamps,
});

export const Arsip = sqliteTable("arsip", {
  id: text()
    .primaryKey()
    .$defaultFn(() => createId()),
  judul: text().notNull(),
  tanggal: integer({ mode: "timestamp" }).notNull(),
  fileName: text().notNull(),
  fileBuffer: blob().$type<ArrayBuffer>().notNull(),
  ...timestamps,
});
