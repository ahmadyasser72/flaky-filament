import { createAccessControl } from "better-auth/plugins/access";
import { adminAc, defaultStatements } from "better-auth/plugins/admin/access";

const readWrite = ["read", "write"] as const;

export const ac = createAccessControl({
	...defaultStatements,
	sekretariat: [...readWrite],
});

export const admin = ac.newRole({
	sekretariat: ["read", "write"],
	...adminAc.statements,
});

export const user = ac.newRole({
	sekretariat: ["read"],
});
