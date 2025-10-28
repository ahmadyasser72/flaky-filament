import {
	blob,
	index,
	integer,
	sqliteTable,
	text,
} from "drizzle-orm/sqlite-core";

import { timestamps } from "./timestamp";

export const Arsip = sqliteTable(
	"arsip",
	{
		id: text().primaryKey(),
		judul: text().notNull(),
		tanggal: integer({ mode: "timestamp" }).notNull(),
		fileName: text().notNull(),
		fileBuffer: blob().$type<ArrayBuffer>().notNull(),
		fileContent: text().notNull().default(""),
		...timestamps,
	},
	(t) => [
		index("arsip_title_idx").on(t.judul),
		index("arsip_filename_idx").on(t.fileName),
		index("arsip_content_idx").on(t.fileContent),
	],
);

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
