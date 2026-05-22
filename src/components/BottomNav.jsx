import { NavLink } from "react-router-dom";
import { ClipboardList, Home, Layers3, ShoppingBag, UserRound } from "lucide-react";

import { useCart } from "../context/CartContext";

const items = [
  { to: "/", label: "Home", icon: Home },
  { to: "/categories", label: "Категории", icon: Layers3 },
  { to: "/cart", label: "Корзина", icon: ShoppingBag },
  { to: "/orders", label: "Заказы", icon: ClipboardList },
  { to: "/profile", label: "Профиль", icon: UserRound },
];

export function BottomNav() {
  const { count } = useCart();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md px-3 safe-bottom">
      <div className="glass grid grid-cols-5 gap-1 rounded-3xl p-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  "relative flex flex-col items-center justify-center gap-1 rounded-2xl px-1 py-2 text-[10px] font-semibold transition",
                  isActive ? "bg-ink text-white shadow-glow" : "text-slate-500 hover:bg-white/70 hover:text-ink",
                ].join(" ")
              }
            >
              <Icon size={19} strokeWidth={2.3} />
              <span className="max-w-full truncate">{item.label}</span>
              {item.to === "/cart" && count > 0 ? (
                <span className="absolute right-2 top-1 grid h-5 min-w-5 place-items-center rounded-full bg-tomato px-1 text-[10px] text-white">
                  {count}
                </span>
              ) : null}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
