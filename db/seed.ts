import { db, Pegawai } from "astro:db";
import { fakerID_ID as faker } from "@faker-js/faker";
import { createId } from "@paralleldrive/cuid2";

// https://astro.build/db/seed
export default async function seed() {
  await Promise.all(
    Array.from({ length: 100 }).map(() =>
      db.insert(Pegawai).values({
        id: createId(),
        nomorIndukPegawai: faker.string.numeric(12),
        namaLengkap: faker.person.fullName(),
        tempatLahir: faker.location.streetAddress({ useFullAddress: true }),
        tanggalLahir: faker.date.birthdate(),
        golonganDarah: faker.helpers.arrayElement(["A", "B", "AB", "O"]),
        jenisKelamin: faker.helpers.arrayElement(["L", "P"]),
      }),
    ),
  );
}
