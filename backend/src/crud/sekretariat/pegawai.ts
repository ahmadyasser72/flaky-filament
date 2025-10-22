import { eq } from "drizzle-orm";
import { z } from "zod";

import { zValidator } from "~/crud/validator";
import { Pegawai } from "~/db";
import { factory } from "~/factory";

const schema = z.object({
  nomorIndukPegawai: z
    .string({ message: "Nomor induk pegawai belum diisi." })
    .regex(
      /^\d{8,20}$/,
      "Nomor induk pegawai harus berupa angka dengan panjang antara 8 hingga 20 digit."
    )
    .nonempty("Nomor induk pegawai wajib diisi."),

  namaLengkap: z
    .string({ message: "Nama lengkap belum diisi." })
    .min(3, "Nama lengkap minimal terdiri dari 3 karakter.")
    .max(100, "Nama lengkap maksimal terdiri dari 100 karakter.")
    .regex(
      /^[a-zA-Z\s'.-]+$/,
      "Nama lengkap hanya boleh mengandung huruf dan karakter umum seperti titik atau tanda hubung."
    ),

  tempatLahir: z
    .string({ message: "Tempat lahir belum diisi." })
    .min(2, "Tempat lahir minimal 2 karakter.")
    .max(100, "Tempat lahir maksimal 100 karakter."),

  tanggalLahir: z
    .preprocess(
      (val) => (typeof val === "string" ? new Date(val) : val),
      z.date({ message: "Tanggal lahir belum diisi." })
    )
    .refine(
      (date) => date <= new Date(),
      "Tanggal lahir tidak boleh lebih dari hari ini."
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

const app = factory
  .createApp()
  // CREATE
  .post("/", zValidator("form", schema), async (c) => {
    const data = c.req.valid("form");
    const [created] = await c.var.db
      .insert(Pegawai)
      .values(data)
      .returning({ id: Pegawai.id });

    return c.json({ data: created });
  })
  // READ
  .get("/:id", async (c) => {
    const { id } = c.req.param();
    const data = await c.var.db.query.Pegawai.findFirst({
      where: (Pegawai, { eq }) => eq(Pegawai.id, id),
    });

    return data === undefined
      ? c.json({ data: null, error: "PEGAWAI NOT FOUND" }, 404)
      : c.json({ data });
  })
  // UPDATE
  .put("/:id", zValidator("form", schema), async (c) => {
    const { id } = c.req.param();
    const data = c.req.valid("form");
    const updated = await c.var.db
      .update(Pegawai)
      .set(data)
      .where(eq(Pegawai.id, id))
      .returning({ id: Pegawai.id });

    return updated.length === 0
      ? c.json({ data: null, error: "PEGAWAI NOT FOUND" }, 404)
      : c.json({ data: updated[0] });
  })
  // DELETE
  .delete("/:id", async (c) => {
    const { id } = c.req.param();
    const deleted = await c.var.db
      .delete(Pegawai)
      .where(eq(Pegawai.id, id))
      .returning({ id: Pegawai.id });

    return deleted.length === 0
      ? c.json({ data: null, error: "PEGAWAI NOT FOUND" }, 404)
      : c.json({ data: deleted[0] });
  })
  // LIST
  .get("/", async (c) => {
    const list = await c.var.db.query.Pegawai.findMany();

    return c.json({ data: list });
  });

export default app;
