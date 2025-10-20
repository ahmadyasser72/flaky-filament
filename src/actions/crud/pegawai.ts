import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";
import { eq, and, ne } from "drizzle-orm";
import { db, Pegawai } from "~/server/db";

const schema = z.object({
  id: z
    .string({ message: "ID belum diisi." })
    .nonempty("ID tidak boleh kosong."),

  nomorIndukPegawai: z
    .string({ message: "Nomor induk pegawai belum diisi." })
    .regex(
      /^\d{8,20}$/,
      "Nomor induk pegawai harus berupa angka dengan panjang antara 8 hingga 20 digit.",
    )
    .nonempty("Nomor induk pegawai wajib diisi."),

  namaLengkap: z
    .string({ message: "Nama lengkap belum diisi." })
    .min(3, "Nama lengkap minimal terdiri dari 3 karakter.")
    .max(100, "Nama lengkap maksimal terdiri dari 100 karakter.")
    .regex(
      /^[a-zA-Z\s'.-]+$/,
      "Nama lengkap hanya boleh mengandung huruf dan karakter umum seperti titik atau tanda hubung.",
    ),

  tempatLahir: z
    .string({ message: "Tempat lahir belum diisi." })
    .min(2, "Tempat lahir minimal 2 karakter.")
    .max(100, "Tempat lahir maksimal 100 karakter."),

  tanggalLahir: z
    .preprocess(
      (val) => (typeof val === "string" ? new Date(val) : val),
      z.date({ message: "Tanggal lahir belum diisi." }),
    )
    .refine(
      (date) => date <= new Date(),
      "Tanggal lahir tidak boleh lebih dari hari ini.",
    )
    .refine((date) => {
      const age = new Date().getFullYear() - date.getFullYear();
      return age >= 17;
    }, "Pegawai harus berusia minimal 17 tahun."),

  jenisKelamin: z.enum(["L", "P"], {
    message: "Jenis kelamin wajib dipilih.",
  }),

  golonganDarah: z.enum(["A", "B", "AB", "O"], {
    message: "Golongan darah wajib dipilih.",
  }),
});

export const pegawai = {
  create: defineAction({
    accept: "form",
    input: schema.omit({ id: true }),
    handler: async (data, context) => {
      await assertUniqueNip(data.nomorIndukPegawai);

      const [pegawai] = await db.insert(Pegawai).values(data).returning();

      return pegawai;
    },
  }),
  read: defineAction({
    input: schema.pick({ id: true }),
    handler: async ({ id }, context) => {
      const results = await db
        .select()
        .from(Pegawai)
        .where(eq(Pegawai.id, id))
        .limit(1);

      if (results.length === 0) throw new ActionError({ code: "NOT_FOUND" });

      return results[0];
    },
  }),
  update: defineAction({
    accept: "form",
    input: schema,
    handler: async ({ id, ...data }, context) => {
      await assertUniqueNip(data.nomorIndukPegawai, id);

      const [pegawai] = await db
        .update(Pegawai)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(Pegawai.id, id))
        .returning();

      return pegawai;
    },
  }),
  delete: defineAction({
    accept: "form",
    input: schema.pick({ id: true }),
    handler: async ({ id }, context) => {
      const results = await db
        .delete(Pegawai)
        .where(eq(Pegawai.id, id))
        .returning();

      if (results.length === 0) throw new ActionError({ code: "NOT_FOUND" });

      return results[0];
    },
  }),
  list: defineAction({
    handler: async (_data, context) => {
      const rows = await db.select().from(Pegawai);

      return rows.reverse();
    },
  }),
};

const assertUniqueNip = async (nomorIndukPegawai: string, id?: string) => {
  const existing = await db
    .select({ id: Pegawai.id })
    .from(Pegawai)
    .where(
      and(
        eq(Pegawai.nomorIndukPegawai, nomorIndukPegawai),
        id !== undefined ? ne(Pegawai.id, id) : undefined,
      ),
    )
    .limit(1);

  if (existing.length > 0) {
    throw new ActionError({
      code: "BAD_REQUEST",
      message: "Sudah terdapat pegawai dengan NIP sama.",
    });
  }
};
