import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { MapPin, Phone, Save } from "lucide-react";

import { updateProfileAddress } from "../api/api";
import { ErrorBanner } from "../components/ErrorBanner";
import { useToast } from "../context/ToastContext";

export function Profile() {
  const { user, setUser } = useOutletContext();
  const toast = useToast();
  const [form, setForm] = useState({
    full_address: "",
    entrance: "",
    floor: "",
    apartment: "",
    comment: "",
    phone: "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setForm({
      full_address: user?.address?.full_address || "",
      entrance: user?.address?.entrance || "",
      floor: user?.address?.floor || "",
      apartment: user?.address?.apartment || "",
      comment: user?.address?.comment || "",
      phone: user?.phone || "",
    });
  }, [user]);

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const nextUser = await updateProfileAddress(form);
      setUser(nextUser);
      toast.success("Профиль обновлен");
      setMessage("Профиль обновлен.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <section className="glass flex items-center gap-4 rounded-3xl p-4">
        {user?.photo_url ? (
          <img src={user.photo_url} alt={user.display_name} className="h-16 w-16 rounded-2xl object-cover" />
        ) : (
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-ink text-xl font-black text-white">
            {(user?.first_name || user?.username || "U").slice(0, 1)}
          </div>
        )}
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-black text-ink">{user?.display_name || "Профиль"}</h1>
          <p className="truncate text-sm font-semibold text-slate-500">
            {user?.username ? `@${user.username}` : `Telegram ID ${user?.telegram_id || ""}`}
          </p>
        </div>
      </section>

      <ErrorBanner message={error} />
      {message ? <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-700">{message}</div> : null}

      <form onSubmit={handleSubmit} className="glass space-y-3 rounded-3xl p-4">
        <h2 className="flex items-center gap-2 font-black text-ink">
          <MapPin size={18} /> Адрес доставки
        </h2>
        <textarea
          value={form.full_address}
          onChange={(event) => setForm((current) => ({ ...current, full_address: event.target.value }))}
          rows={3}
          placeholder="Улица, дом"
          className="w-full resize-none rounded-2xl border border-orange-100 bg-white/90 px-4 py-3 outline-none focus:border-tomato"
        />
        <div className="grid grid-cols-3 gap-2">
          <input
            value={form.entrance}
            onChange={(event) => setForm((current) => ({ ...current, entrance: event.target.value }))}
            placeholder="Подъезд"
            className="w-full rounded-2xl border border-orange-100 bg-white/90 px-3 py-3 outline-none focus:border-tomato"
          />
          <input
            value={form.floor}
            onChange={(event) => setForm((current) => ({ ...current, floor: event.target.value }))}
            placeholder="Этаж"
            className="w-full rounded-2xl border border-orange-100 bg-white/90 px-3 py-3 outline-none focus:border-tomato"
          />
          <input
            value={form.apartment}
            onChange={(event) => setForm((current) => ({ ...current, apartment: event.target.value }))}
            placeholder="Кв."
            className="w-full rounded-2xl border border-orange-100 bg-white/90 px-3 py-3 outline-none focus:border-tomato"
          />
        </div>
        <label className="block">
          <span className="mb-2 flex items-center gap-2 text-sm font-black text-ink">
            <Phone size={16} /> Телефон
          </span>
          <input
            value={form.phone}
            onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
            className="w-full rounded-2xl border border-orange-100 bg-white/90 px-4 py-3 outline-none focus:border-tomato"
          />
        </label>
        <textarea
          value={form.comment}
          onChange={(event) => setForm((current) => ({ ...current, comment: event.target.value }))}
          rows={2}
          placeholder="Комментарий к адресу"
          className="w-full resize-none rounded-2xl border border-orange-100 bg-white/90 px-4 py-3 outline-none focus:border-tomato"
        />
        <button
          type="submit"
          disabled={saving}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-ink px-5 py-4 font-black text-white shadow-glow disabled:opacity-60"
        >
          <Save size={18} /> {saving ? "Сохраняем..." : "Сохранить"}
        </button>
      </form>
    </div>
  );
}
