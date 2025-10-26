export const formatDate = (date: Date | string) =>
	(date instanceof Date ? date : new Date(date)).toISOString().split("T")[0];
