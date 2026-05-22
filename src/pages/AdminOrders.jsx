import { useEffect, useState } from "react";

import { adminOrders, adminUpdateOrderStatus } from "../api/api";
import { AdminNav } from "../components/AdminNav";
import { ErrorBanner } from "../components/ErrorBanner";
import { orderStatuses, StatusBadge } from "../components/StatusBadge";
import { formatDate, formatPrice } from "../utils/format";

export function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function load(nextStatus = status) {
    setLoading(true);
    setError("");
    try {
      setOrders(await adminOrders(nextStatus));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(status);
  }, [status]);

  async function changeStatus(orderId, nextStatus) {
    try {
      const updated = await adminUpdateOrderStatus(orderId, nextStatus);
      setOrders((current) => current.map((order) => (order.id === orderId ? updated : order)));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <AdminNav />
      <div className="mx-auto max-w-6xl space-y-5">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <h1 className="text-3xl font-black text-ink">Заказы</h1>
            <p className="mt-1 font-semibold text-slate-500">{orders.length} записей</p>
          </div>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="rounded-2xl border border-white bg-white/80 px-4 py-3 font-bold outline-none"
          >
            <option value="">Все статусы</option>
            {orderStatuses.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <ErrorBanner message={error} />
        {loading ? <p className="glass rounded-3xl p-6 font-bold text-slate-500">Загружаем...</p> : null}

        <div className="overflow-hidden rounded-3xl bg-white/80 shadow-soft">
          <div className="hidden grid-cols-[90px_1.2fr_1fr_1fr_150px_170px] gap-4 border-b border-orange-100 px-4 py-3 text-xs font-black uppercase text-slate-400 md:grid">
            <span>ID</span>
            <span>Клиент</span>
            <span>Сумма</span>
            <span>Статус</span>
            <span>Дата</span>
            <span>Сменить</span>
          </div>
          {orders.map((order) => (
            <div
              key={order.id}
              className="grid gap-3 border-b border-orange-100 p-4 last:border-b-0 md:grid-cols-[90px_1.2fr_1fr_1fr_150px_170px] md:items-center"
            >
              <span className="font-black text-ink">#{order.id}</span>
              <span className="min-w-0">
                <span className="block truncate font-bold text-ink">{order.user?.display_name}</span>
                <span className="block truncate text-sm text-slate-500">{order.phone || order.user?.phone}</span>
              </span>
              <span className="font-black text-ink">{formatPrice(order.total_amount)}</span>
              <StatusBadge status={order.status} />
              <span className="text-sm font-semibold text-slate-500">{formatDate(order.created_at)}</span>
              <select
                value={order.status}
                onChange={(event) => changeStatus(order.id, event.target.value)}
                className="rounded-2xl border border-orange-100 bg-white px-3 py-2 text-sm font-bold outline-none"
              >
                {orderStatuses.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
