import { ShoppingBag } from "lucide-react";

export function EmptyState({ title, text, action }) {
  return (
    <div className="glass flex flex-col items-center rounded-3xl px-6 py-10 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-orange-100 text-tomato">
        <ShoppingBag size={24} />
      </div>
      <h3 className="mt-4 text-lg font-black text-ink">{title}</h3>
      {text ? <p className="mt-2 text-sm text-slate-500">{text}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
