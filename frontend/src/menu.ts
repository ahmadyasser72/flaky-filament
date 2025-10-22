export interface MenuItem {
	label: string;
	href?: string;
	icon?: string;
	submenus?: MenuItem[];
}

export const menus = [
	{ label: "Dashboard", href: "/dashboard", icon: "lucide:area-chart" },
	{
		label: "Sekretariat",
		submenus: [
			{
				href: "/crud/sekretariat.arsip",
				label: "Pengarsipan",
				icon: "lucide:package-open",
			},
			{
				href: "/crud/sekretariat.pegawai",
				label: "Kepegawaian",
				icon: "lucide:users",
			},
		],
	},
] satisfies MenuItem[];
