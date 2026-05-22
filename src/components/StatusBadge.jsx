const statusStyles = {
  new: "bg-blue-50 text-blue-700",
  accepted: "bg-amber-50 text-amber-700",
  cooking: "bg-orange-50 text-orange-700",
  delivering: "bg-violet-50 text-violet-700",
  completed: "bg-emerald-50 text-emerald-700",
  canceled: "bg-red-50 text-red-700",
};

const labels = {
  new: "Новый",
  accepted: "Принят",
  cooking: "Готовится",
  delivering: "Доставка",
  completed: "Завершен",
  canceled: "Отменен",
};

export const orderStatuses = [
  ["new", "Новый"],
  ["accepted", "Принят"],
  ["cooking", "Готовится"],
  ["delivering", "Доставляется"],
  ["completed", "Завершен"],
  ["canceled", "Отменен"],
];

export function StatusBadge({ status }) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-black ${statusStyles[status] || "bg-slate-100 text-slate-600"}`}>
      {labels[status] || status}
    </span>
  );
}
