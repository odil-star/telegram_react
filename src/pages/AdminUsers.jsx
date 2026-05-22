import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import { adminCreateUser, adminUsers } from "../api/api";
import { AdminNav } from "../components/AdminNav";
import { ErrorBanner } from "../components/ErrorBanner";

const emptyForm = { username: "", password: "", role: "manager" };

export function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setError("");
    try {
      setUsers(await adminUsers());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function submit(event) {
    event.preventDefault();
    setError("");
    try {
      await adminCreateUser(form);
      setForm(emptyForm);
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <AdminNav />
      <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[360px_1fr]">
        <form onSubmit={submit} className="glass h-fit space-y-3 rounded-3xl p-5">
          <h1 className="text-2xl font-black text-ink">Новый пользователь</h1>
          <ErrorBanner message={error} />
          <input
            value={form.username}
            onChange={(event) => setForm((current) => ({ ...current, username: event.target.value }))}
            placeholder="Username"
            className="w-full rounded-2xl border border-orange-100 bg-white/90 px-4 py-3 outline-none focus:border-tomato"
          />
          <input
            value={form.password}
            onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
            placeholder="Password"
            type="password"
            className="w-full rounded-2xl border border-orange-100 bg-white/90 px-4 py-3 outline-none focus:border-tomato"
          />
          <select
            value={form.role}
            onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))}
            className="w-full rounded-2xl border border-orange-100 bg-white/90 px-4 py-3 font-bold outline-none"
          >
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>
          <button className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-ink px-4 py-3 font-black text-white">
            <Plus size={18} /> Создать
          </button>
        </form>

        <section className="space-y-3">
          <div>
            <h2 className="text-2xl font-black text-ink">Users</h2>
            <p className="font-semibold text-slate-500">{users.length} аккаунтов</p>
          </div>
          {loading ? <p className="glass rounded-3xl p-6 font-bold text-slate-500">Загружаем...</p> : null}
          {users.map((user) => (
            <article key={user.id} className="glass flex items-center justify-between gap-3 rounded-3xl p-4">
              <div>
                <h3 className="text-lg font-black text-ink">{user.username}</h3>
                <p className="text-sm font-bold text-slate-500">{user.role}</p>
              </div>
              <span className="rounded-2xl bg-white px-3 py-2 text-sm font-black text-slate-600">
                {user.is_active ? "active" : "disabled"}
              </span>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
