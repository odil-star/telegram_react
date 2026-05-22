import { useEffect, useState } from "react";
import { BarChart3, ClipboardList, ListChecks, UsersRound } from "lucide-react";

import { adminDashboard } from "../api/api";
import { AdminNav } from "../components/AdminNav";
import { ErrorBanner } from "../components/ErrorBanner";

const cards = [
  { title: "Leads", icon: ClipboardList, items: [["total", "Всего"], ["new", "Новые"], ["in_work", "В работе"], ["completed", "Готово"]] },
  { title: "Users", icon: UsersRound, items: [["total", "Всего"], ["admins", "Admins"], ["managers", "Managers"]] },
  { title: "Tasks", icon: ListChecks, items: [["total", "Всего"], ["open", "Open"], ["done", "Done"]] },
  { title: "Visits", icon: BarChart3, items: [["today", "Сегодня"], ["week", "7 дней"], ["month", "30 дней"]] },
];

export function AdminDashboard() {
  const [metrics, setMetrics] = useState(null);
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

  return (
    <div>
      <AdminNav />
      <div className="mx-auto max-w-6xl space-y-5">
        <div>
          <h1 className="text-3xl font-black text-ink">Dashboard</h1>
          <p className="mt-1 font-semibold text-slate-500">JSON API, Django session auth</p>
        </div>

        <ErrorBanner message={error} />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {cards.map(({ title, icon: Icon, items }) => {
            const key = title.toLowerCase();
            return (
              <section key={title} className="glass rounded-3xl p-5">
                <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-white text-tomato shadow-sm">
                  <Icon size={22} />
                </div>
                <h2 className="text-lg font-black text-ink">{title}</h2>
                <div className="mt-4 space-y-3">
                  {items.map(([valueKey, label]) => (
                    <div key={valueKey} className="flex items-center justify-between gap-3 rounded-2xl bg-white/70 px-3 py-2">
                      <span className="text-sm font-bold text-slate-500">{label}</span>
                      <span className="text-xl font-black text-ink">
                        {loading || !metrics ? "..." : metrics[key]?.[valueKey] ?? 0}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
