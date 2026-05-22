import { motion } from "framer-motion";

export function CategoryTabs({ categories, active, onChange }) {
  return (
    <div className="scrollbar-hide -mx-4 flex gap-2 overflow-x-auto px-4 py-1">
      <button
        onClick={() => onChange("all")}
        className={[
          "relative shrink-0 rounded-2xl px-4 py-2 text-sm font-bold transition",
          active === "all" ? "text-white" : "bg-white/75 text-slate-600 shadow-sm",
        ].join(" ")}
      >
        {active === "all" ? (
          <motion.span layoutId="category-pill" className="absolute inset-0 rounded-2xl bg-ink" />
        ) : null}
        <span className="relative">Все</span>
      </button>
      {categories.map((category) => (
        <button
          key={category.slug}
          onClick={() => onChange(category.slug)}
          className={[
            "relative shrink-0 rounded-2xl px-4 py-2 text-sm font-bold transition",
            active === category.slug ? "text-white" : "bg-white/75 text-slate-600 shadow-sm",
          ].join(" ")}
        >
          {active === category.slug ? (
            <motion.span layoutId="category-pill" className="absolute inset-0 rounded-2xl bg-ink" />
          ) : null}
          <span className="relative">{category.name}</span>
        </button>
      ))}
    </div>
  );
}
