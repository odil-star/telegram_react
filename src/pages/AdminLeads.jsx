import { useEffect, useState } from "react";

import { adminLeads, adminUpdateLead, adminUsers } from "../api/api";
import { AdminNav } from "../components/AdminNav";
import { ErrorBanner } from "../components/ErrorBanner";
import { formatDate } from "../utils/format";

const leadStatuses = [
  ["new", "New"],
  ["in_work", "In work"],
  ["completed", "Completed"],
  ["rejected", "Rejected"],
];

export function AdminLeads() {
  const [leads, setLeads] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const [leadData, userData] = await Promise.all([
        adminLeads(),
        adminUsers().catch(() => []),
      ]);
      setLeads(leadData);
      setUsers(userData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function patchLead(id, payload) {
    setError("");
    try {
      const updated = await adminUpdateLead(id, payload);
      setLeads((current) => current.map((lead) => (lead.id === id ? updated : lead)));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <AdminNav />
      <div className="mx-auto max-w-6xl space-y-5">
        <div>
          <h1 className="text-3xl font-black text-ink">Leads</h1>
          <p className="mt-1 font-semibold text-slate-500">{leads.length} заявок</p>
        </div>
        <ErrorBanner message={error} />
        {loading ? <p className="glass rounded-3xl p-6 font-bold text-slate-500">Загружаем...</p> : null}
        <div className="space-y-3">
          {leads.map((lead) => (
            <article key={lead.id} className="glass grid gap-3 rounded-3xl p-4 lg:grid-cols-[1fr_180px_180px_160px] lg:items-center">
              <div className="min-w-0">
                <h2 className="truncate text-lg font-black text-ink">{lead.name || "Без имени"}</h2>
                <p className="font-bold text-slate-600">{lead.phone}</p>
                <p className="mt-1 text-sm text-slate-500">{lead.service} {lead.tariff ? `· ${lead.tariff}` : ""}</p>
                {lead.message ? <p className="mt-2 line-clamp-2 text-sm text-slate-500">{lead.message}</p> : null}
              </div>
              <select
                value={lead.status}
                onChange={(event) => patchLead(lead.id, { status: event.target.value })}
                className="rounded-2xl border border-orange-100 bg-white px-3 py-2 font-bold outline-none"
              >
                {leadStatuses.map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              <select
                value={lead.assigned_to || ""}
                onChange={(event) => patchLead(lead.id, { assigned_to: event.target.value || null })}
                className="rounded-2xl border border-orange-100 bg-white px-3 py-2 font-bold outline-none"
              >
                <option value="">Не назначен</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>{user.username}</option>
                ))}
              </select>
              <span className="text-sm font-semibold text-slate-500">{formatDate(lead.created_at)}</span>
            </article>
          ))}
          {!loading && !leads.length ? (
            <div className="glass rounded-3xl p-8 text-center font-bold text-slate-500">Заявок пока нет</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
