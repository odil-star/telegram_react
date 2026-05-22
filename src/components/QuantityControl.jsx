import { Minus, Plus, Trash2 } from "lucide-react";

export function QuantityControl({ quantity, onDecrease, onIncrease, onRemove }) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={quantity <= 1 ? onRemove : onDecrease}
        className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-700"
        aria-label={quantity <= 1 ? "Удалить" : "Уменьшить"}
      >
        {quantity <= 1 ? <Trash2 size={16} /> : <Minus size={16} />}
      </button>
      <span className="grid h-9 min-w-9 place-items-center rounded-full bg-white px-3 text-sm font-black text-ink">
        {quantity}
      </span>
      <button
        type="button"
        onClick={onIncrease}
        className="grid h-9 w-9 place-items-center rounded-full bg-ink text-white"
        aria-label="Увеличить"
      >
        <Plus size={16} />
      </button>
    </div>
  );
}
