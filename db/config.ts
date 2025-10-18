import { defineDb } from "astro:db";

import * as sekretariat from "./schema/sekretariat";

// https://astro.build/db/config
export default defineDb({
  tables: { ...sekretariat },
});
