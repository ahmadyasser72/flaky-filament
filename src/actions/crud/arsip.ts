import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";
import { eq } from "drizzle-orm";
import { Arsip, db } from "~/server/db";

const schema = z.object({
  id: z
    .string({ message: "ID belum diisi." })
    .nonempty("ID tidak boleh kosong."),

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

  file: z
    .instanceof(File)
    .refine((file) => file.name !== "", "File belum dipilih.")
    .refine(
      (file) => file.type === "application/pdf",
      "File harus berupa dokumen PDF.",
    )
    .refine(
      (file) => file.size <= 10 * 1024 * 1024,
      "Ukuran file tidak boleh melebihi 10 MB.",
    ),
});

export const arsip = {
  create: defineAction({
    accept: "form",
    input: schema.omit({ id: true }),
    handler: async (data, context) => {
      const file = await data.file.arrayBuffer();
      const [arsip] = await db
        .insert(Arsip)
        .values({ ...data, fileName: data.file.name, fileBuffer: file })
        .returning();

      return arsip;
    },
  }),
  read: defineAction({
    input: schema.pick({ id: true }),
    handler: async ({ id }, context) => {
      const results = await db
        .select()
        .from(Arsip)
        .where(eq(Arsip.id, id))
        .limit(1);

      if (results.length === 0) throw new ActionError({ code: "NOT_FOUND" });

      return results[0];
    },
  }),
  update: defineAction({
    accept: "form",
    input: schema.omit({ file: true }),
    handler: async ({ id, ...data }, context) => {
      const [arsip] = await db
        .update(Arsip)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(eq(Arsip.id, id))
        .returning();

      return arsip;
    },
  }),
  delete: defineAction({
    accept: "form",
    input: schema.pick({ id: true }),
    handler: async ({ id }, context) => {
      const results = await db
        .delete(Arsip)
        .where(eq(Arsip.id, id))
        .returning();

      if (results.length === 0) throw new ActionError({ code: "NOT_FOUND" });

      return results[0];
    },
  }),
  list: defineAction({
    handler: async (_data, context) => {
      const rows = await db.select().from(Arsip);

      return rows.reverse();
    },
  }),
};
