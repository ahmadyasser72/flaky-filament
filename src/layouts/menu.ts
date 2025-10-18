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
        href: "/sekretariat/inventaris-kantor",
        label: "Inventaris Kantor",
        icon: "lucide:package",
      },
      {
        href: "/sekretariat/pegawai",
        label: "Kepegawaian",
        icon: "lucide:users",
      },
    ],
  },
] satisfies MenuItem[];
