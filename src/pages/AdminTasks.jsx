import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import { adminCreateTask, adminTasks, adminUpdateTask, adminUsers } from "../api/api";
import { AdminNav } from "../components/AdminNav";
import { ErrorBanner } from "../components/ErrorBanner";
import { formatDate } from "../utils/format";

const emptyTask = {
  title: "",
  description: "",
  assigned_to: "",
  priority: "normal",
  due_date: "",
};

export function AdminTasks() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(emptyTask);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const [taskData, userData] = await Promise.all([
        adminTasks(),
        adminUsers().catch(() => []),
      ]);
      setTasks(taskData);
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

  async function submit(event) {
    event.preventDefault();
    setError("");
    try {
      await adminCreateTask({ ...form, assigned_to: form.assigned_to || null, due_date: form.due_date || null });
      setForm(emptyTask);
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function setDone(task) {
    setError("");
    try {
      const updated = await adminUpdateTask(task.id, { status: task.status === "done" ? "open" : "done" });
      setTasks((current) => current.map((item) => (item.id === task.id ? updated : item)));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <AdminNav />
      <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[380px_1fr]">
        <form onSubmit={submit} className="glass h-fit space-y-3 rounded-3xl p-5">
          <h1 className="text-2xl font-black text-ink">Новая задача</h1>
          <ErrorBanner message={error} />
          <input
            value={form.title}
            onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
            placeholder="Title"
            className="w-full rounded-2xl border border-orange-100 bg-white/90 px-4 py-3 outline-none focus:border-tomato"
          />
          <textarea
            value={form.description}
            onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
            placeholder="Description"
            rows={3}
            className="w-full resize-none rounded-2xl border border-orange-100 bg-white/90 px-4 py-3 outline-none focus:border-tomato"
          />
          <select
            value={form.assigned_to}
            onChange={(event) => setForm((current) => ({ ...current, assigned_to: event.target.value }))}
            className="w-full rounded-2xl border border-orange-100 bg-white/90 px-4 py-3 font-bold outline-none"
          >
            <option value="">Без исполнителя</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>{user.username}</option>
            ))}
          </select>
          <div className="grid grid-cols-2 gap-2">
            <select
              value={form.priority}
              onChange={(event) => setForm((current) => ({ ...current, priority: event.target.value }))}
              className="rounded-2xl border border-orange-100 bg-white/90 px-4 py-3 font-bold outline-none"
            >
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
            </select>
            <input
              value={form.due_date}
              onChange={(event) => setForm((current) => ({ ...current, due_date: event.target.value }))}
              type="date"
              className="rounded-2xl border border-orange-100 bg-white/90 px-4 py-3 font-bold outline-none"
            />
          </div>
          <button className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-ink px-4 py-3 font-black text-white">
            <Plus size={18} /> Создать
          </button>
        </form>

        <section className="space-y-3">
          <div>
            <h2 className="text-2xl font-black text-ink">Tasks</h2>
            <p className="font-semibold text-slate-500">{tasks.length} задач</p>
          </div>
          {loading ? <p className="glass rounded-3xl p-6 font-bold text-slate-500">Загружаем...</p> : null}
          {tasks.map((task) => (
            <article key={task.id} className="glass flex flex-col gap-3 rounded-3xl p-4 md:flex-row md:items-center">
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-black text-ink">{task.title}</h3>
                <p className="line-clamp-2 text-sm text-slate-500">{task.description}</p>
                <p className="mt-2 text-xs font-black uppercase text-slate-400">
                  {task.priority} · {task.assigned_to_user?.username || "unassigned"}
                  {task.due_date ? ` · due ${formatDate(task.due_date)}` : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDone(task)}
                className={[
                  "rounded-2xl px-4 py-2 text-sm font-black",
                  task.status === "done" ? "bg-basil text-white" : "bg-white text-slate-700",
                ].join(" ")}
              >
                {task.status === "done" ? "Done" : "Open"}
              </button>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
