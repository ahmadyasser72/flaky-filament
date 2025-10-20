import type { Arsip, Pegawai } from "~/server/db";

interface ColumnDef<T, K extends keyof T> {
  header?: (columnName: string) => string;
  format?: (value: T[K], others: T) => string;
  width?: number;
}

type Columns<T> = {
  [K in keyof Omit<T, "id" | "createdAt" | "updatedAt">]-?:
    | ColumnDef<T, K>
    | false;
};

type DataMap = {
  pegawai: typeof Pegawai.$inferSelect;
  arsip: typeof Arsip.$inferInsert;
};

export interface GenericDataTable<K extends keyof DataMap> {
  base: string;
  name: K;
  getDetail: (data: DataMap[K]) => string;
  columns: Columns<DataMap[K]>;
}

export const defineDataTable = <T extends keyof DataMap>(
  props: GenericDataTable<T>,
) => props as unknown as GenericDataTable<"pegawai">; // TODO: do actual generic when astro component support them
