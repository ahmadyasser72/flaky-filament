ALTER TABLE `arsip` RENAME COLUMN "file" TO "file_name";--> statement-breakpoint
ALTER TABLE `arsip` ADD `file_content` text DEFAULT '' NOT NULL;--> statement-breakpoint
CREATE INDEX `arsip_title_idx` ON `arsip` (`judul`);--> statement-breakpoint
CREATE INDEX `arsip_filename_idx` ON `arsip` (`file_name`);--> statement-breakpoint
CREATE INDEX `arsip_content_idx` ON `arsip` (`file_content`);