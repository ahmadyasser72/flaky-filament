import { eq } from "drizzle-orm";
import { extractText, getDocumentProxy } from "unpdf";
import { z } from "zod";

import { zValidator } from "~/crud/validator";
import { Arsip } from "~/db";
import { factory } from "~/factory";

const fileSchema = z
	.instanceof(File)
	.refine((file) => file.name !== "", "File belum dipilih.")
	.refine(
		(file) => file.type === "application/pdf",
		"File harus berupa dokumen PDF.",
	)
	.refine(
		(file) => file.size <= 10 * 1024 * 1024,
		"Ukuran file tidak boleh melebihi 10 MB.",
	);

const schema = z.object({
	judul: z
		.string({ message: "Judul belum diisi." })
		.min(3, "Judul minimal terdiri dari 3 karakter.")
		.max(150, "Judul maksimal terdiri dari 150 karakter."),

	tanggal: z
		.preprocess(
			(val) => (typeof val === "string" ? new Date(val) : val),
			z.date({ message: "Tanggal belum diisi." }),
		)
		.refine((date) => !isNaN(date.getTime()), "Tanggal tidak valid.")
		.refine(
			(date) => date <= new Date(),
			"Tanggal tidak boleh lebih dari hari ini.",
		),
});

export const app = factory
	.createApp()
	// CREATE
	.post(
		"/",
		zValidator("form", schema.extend({ file: fileSchema })),
		async (c) => {
			const data = c.req.valid("form");
			const file = await parsePdfFile(data.file);

			const [created] = await c.var.db
				.insert(Arsip)
				.values({
					id: c.var.createId(),
					...data,
					...file!,
				})
				.returning({ id: Arsip.id });

			return c.json({ data: created }, 200);
		},
	)
	// READ
	.get("/:id", async (c) => {
		const { id } = c.req.param();
		const data = await c.var.db.query.Arsip.findFirst({
			columns: { fileBuffer: false },
			where: (arsip, { eq }) => eq(arsip.id, id),
		});

		return data === undefined
			? c.json({ data: null, error: "ARSIP NOT FOUND" }, 404)
			: c.json({ data }, 200);
	})
	// UPDATE
	.put(
		"/:id",
		zValidator("form", schema.extend({ file: fileSchema.optional() })),
		async (c) => {
			const { id } = c.req.param();
			const data = c.req.valid("form");
			const file = await parsePdfFile(data.file);

			const updated = await c.var.db
				.update(Arsip)
				.set({ ...data, ...file })
				.where(eq(Arsip.id, id))
				.returning({ id: Arsip.id });

			return updated.length === 0
				? c.json({ data: null, error: "ARSIP NOT FOUND" }, 404)
				: c.json({ data: updated[0] }, 200);
		},
	)
	// DELETE
	.delete("/:id", async (c) => {
		const { id } = c.req.param();
		const deleted = await c.var.db
			.delete(Arsip)
			.where(eq(Arsip.id, id))
			.returning({ id: Arsip.id });

		return deleted.length === 0
			? c.json({ data: null, error: "ARSIP NOT FOUND" }, 404)
			: c.json({ data: deleted[0] }, 200);
	})
	// LIST
	.get("/", async (c) => {
		const list = await c.var.db.query.Arsip.findMany({
			columns: { fileBuffer: false },
		});

		return c.json({ data: list }, 200);
	})
	// DOWNLOAD FILE
	.get("/:id/file", async (c) => {
		const { id } = c.req.param();
		const data = await c.var.db.query.Arsip.findFirst({
			columns: { fileName: true, fileBuffer: true },
			where: (arsip, { eq }) => eq(arsip.id, id),
		});

		if (data === undefined)
			return c.json({ data: null, error: "ARSIP NOT FOUND" }, 404);

		return new Response(data.fileBuffer, {
			headers: {
				"content-type": "application/pdf",
				"content-length": data.fileBuffer.byteLength.toString(),
				"content-disposition": `attachment; filename="${data.fileName}"`,
			},
		});
	});

const parsePdfFile = async (file?: File) => {
	if (!file) return;

	const buffer = await file.arrayBuffer();
	const pdf = await getDocumentProxy(copiedBuffer(buffer));
	const { text } = await extractText(pdf, { mergePages: true });

	return { fileName: file.name, fileBuffer: buffer, fileContent: text };
};

const copiedBuffer = (src: ArrayBuffer) => {
	var dst = new ArrayBuffer(src.byteLength);
	new Uint8Array(dst).set(new Uint8Array(src));
	return dst;
};
