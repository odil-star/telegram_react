import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ClipboardList } from "lucide-react";

import { getMyOrders } from "../api/api";
import { EmptyState } from "../components/EmptyState";
import { ErrorBanner } from "../components/ErrorBanner";
import { StatusBadge } from "../components/StatusBadge";
import { formatDate, formatPrice } from "../utils/format";

export function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await getMyOrders();
        if (alive) setOrders(data);
      } catch (err) {
        if (alive) setError(err.message);
      } finally {
        if (alive) setLoading(false);
      }
    }
    load();
    return () => {
      alive = false;
    };
  }, []);

  if (!loading && !orders.length) {
    return (
      <EmptyState
        title="Заказов пока нет"
        text="История появится после оформления."
        action={
          <Link to="/" className="rounded-2xl bg-ink px-5 py-3 font-black text-white">
            В меню
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-cheese text-white">
          <ClipboardList size={22} />
        </div>
        <div>
          <h1 className="text-2xl font-black text-ink">История заказов</h1>
          <p className="text-sm font-semibold text-slate-500">{orders.length} заказов</p>
        </div>
      </div>
      <ErrorBanner message={error} />
      {loading ? <p className="glass rounded-3xl p-6 text-center font-bold text-slate-500">Загружаем...</p> : null}
      {orders.map((order) => (
        <article key={order.id} className="glass rounded-3xl p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-ink">Заказ #{order.id}</h2>
              <p className="text-sm font-semibold text-slate-500">{formatDate(order.created_at)}</p>
            </div>
            <StatusBadge status={order.status} />
          </div>
          <div className="mt-4 space-y-2">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between gap-3 text-sm">
                <span className="text-slate-600">
                  {item.product_name} x {item.quantity}
                </span>
                <span className="font-black text-ink">{formatPrice(item.total)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-white/70 pt-3">
            <span className="text-sm font-bold text-slate-500">{order.delivery_method_label}</span>
            <span className="text-lg font-black text-ink">{formatPrice(order.total_amount)}</span>
          </div>
        </article>
      ))}
    </div>
  );
}
