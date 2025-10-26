CREATE TABLE `arsip` (
	`id` text PRIMARY KEY NOT NULL,
	`judul` text NOT NULL,
	`tanggal` integer NOT NULL,
	`file` text NOT NULL,
	`file_buffer` blob NOT NULL,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `pegawai` (
	`id` text PRIMARY KEY NOT NULL,
	`nomor_induk_pegawai` text NOT NULL,
	`nama_lengkap` text NOT NULL,
	`tempat_lahir` text NOT NULL,
	`tanggal_lahir` integer NOT NULL,
	`jenis_kelamin` text NOT NULL,
	`golongan_darah` text NOT NULL,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `pegawai_nomorIndukPegawai_unique` ON `pegawai` (`nomor_induk_pegawai`);