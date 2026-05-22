import { NavLink, useNavigate } from "react-router-dom";
import { Boxes, ClipboardList, LayoutDashboard, ListChecks, LogOut, Tags, UsersRound } from "lucide-react";

import { adminLogout } from "../api/api";

const links = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/leads", label: "Leads", icon: ClipboardList },
  { to: "/admin/tasks", label: "Tasks", icon: ListChecks },
  { to: "/admin/users", label: "Users", icon: UsersRound },
  { to: "/admin/orders", label: "Заказы", icon: ClipboardList },
  { to: "/admin/products", label: "Товары", icon: Boxes },
  { to: "/admin/categories", label: "Категории", icon: Tags },
];

export function AdminNav() {
  const navigate = useNavigate();

  async function logout() {
    await adminLogout().catch(() => {});
    navigate("/admin/login", { replace: true });
  }

  return (
    <header className="sticky top-0 z-30 -mx-4 mb-5 bg-orange-50/85 px-4 py-3 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-3 overflow-x-auto">
        <div className="mr-2 shrink-0 text-lg font-black text-ink">FastFood Admin</div>
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                [
                  "inline-flex shrink-0 items-center gap-2 rounded-2xl px-4 py-2 text-sm font-black transition",
                  isActive ? "bg-ink text-white" : "bg-white/70 text-slate-600 hover:bg-white",
                ].join(" ")
              }
            >
              <Icon size={17} />
              {link.label}
            </NavLink>
          );
        })}
        <button
          type="button"
          onClick={logout}
          className="ml-auto inline-flex shrink-0 items-center gap-2 rounded-2xl bg-white/80 px-4 py-2 text-sm font-black text-slate-600 hover:bg-white"
        >
          <LogOut size={17} />
          Выйти
        </button>
      </div>
    </header>
  );
}
