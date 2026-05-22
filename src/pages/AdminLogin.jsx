import { useEffect, useState } from "react";
import { LockKeyhole, LogIn } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { adminLogin, adminMe } from "../api/api";
import { ErrorBanner } from "../components/ErrorBanner";

export function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const from = location.state?.from?.pathname || "/admin";

  useEffect(() => {
    adminMe()
      .then(() => navigate(from, { replace: true }))
      .catch(() => {});
  }, [from, navigate]);

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      await adminLogin(form);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Не удалось войти");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-[calc(100vh-24px)] place-items-center">
      <form onSubmit={submit} className="glass w-full max-w-md space-y-4 rounded-3xl p-6 shadow-soft">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-ink text-white">
          <LockKeyhole size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-ink">Admin login</h1>
          <p className="mt-1 font-semibold text-slate-500">Вход через Django username и password</p>
        </div>
        <ErrorBanner message={error} />
        <input
          value={form.username}
          onChange={(event) => setForm((current) => ({ ...current, username: event.target.value }))}
          autoComplete="username"
          placeholder="Username"
          className="w-full rounded-2xl border border-orange-100 bg-white/90 px-4 py-3 font-semibold outline-none focus:border-tomato"
        />
        <input
          value={form.password}
          onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
          autoComplete="current-password"
          placeholder="Password"
          type="password"
          className="w-full rounded-2xl border border-orange-100 bg-white/90 px-4 py-3 font-semibold outline-none focus:border-tomato"
        />
        <button
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-ink px-4 py-3 font-black text-white disabled:opacity-60"
        >
          <LogIn size={18} />
          {loading ? "Входим..." : "Войти"}
        </button>
      </form>
    </main>
  );
}
