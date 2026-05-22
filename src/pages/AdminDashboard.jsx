import { useEffect, useState } from "react";
import { Boxes, ClipboardList, DollarSign, KeyRound, Sparkles } from "lucide-react";

import { adminDashboard, getAdminToken, setAdminToken } from "../api/api";
import { AdminNav } from "../components/AdminNav";
import { ErrorBanner } from "../components/ErrorBanner";
import { formatPrice } from "../utils/format";

const metricConfig = [
  ["orders_total", "Всего заказов", ClipboardList],
  ["new_orders", "Новые", Sparkles],
  ["sales_total", "Продажи", DollarSign],
  ["products_total", "Товары", Boxes],
];

export function AdminDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [token, setToken] = useState(getAdminToken());
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setError("");
    try {
      setMetrics(await adminDashboard());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function saveToken(event) {
    event.preventDefault();
    setAdminToken(token);
    load();
  }

  return (
    <div>
      <AdminNav />
      <div className="mx-auto max-w-6xl space-y-5">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="text-3xl font-black text-ink">Dashboard</h1>
            <p className="mt-1 font-semibold text-slate-500">Сводка магазина</p>
          </div>
          <form onSubmit={saveToken} className="glass flex items-center gap-2 rounded-3xl p-2">
            <KeyRound size={18} className="ml-2 text-slate-500" />
            <input
              value={token}
              onChange={(event) => setToken(event.target.value)}
              className="min-w-0 bg-transparent px-2 py-2 text-sm font-semibold outline-none"
            />
            <button className="rounded-2xl bg-ink px-4 py-2 text-sm font-black text-white">OK</button>
          </form>
        </div>

        <ErrorBanner message={error} />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metricConfig.map(([key, label, Icon]) => (
            <div key={key} className="glass rounded-3xl p-5">
              <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-white text-tomato shadow-sm">
                <Icon size={22} />
              </div>
              <p className="text-sm font-bold text-slate-500">{label}</p>
              <p className="mt-1 text-3xl font-black text-ink">
                {loading || !metrics ? "..." : key === "sales_total" ? formatPrice(metrics[key]) : metrics[key]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
