import { useEffect, useState } from "react";
import { MapPin, X } from "lucide-react";
import { motion } from "framer-motion";

import { updateProfileAddress } from "../api/api";
import { useToast } from "../context/ToastContext";

export function AddressPrompt({ user, onSaved }) {
  const toast = useToast();
  const hasAddress = Boolean(user?.address?.full_address);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    full_address: "",
    entrance: "",
    floor: "",
    apartment: "",
    comment: "",
    phone: "",
  });

  useEffect(() => {
    if (user && !hasAddress) setOpen(true);
    if (user) {
      setForm({
        full_address: user.address?.full_address || "",
        entrance: user.address?.entrance || "",
        floor: user.address?.floor || "",
        apartment: user.address?.apartment || "",
        comment: user.address?.comment || "",
        phone: user.phone || "",
      });
    }
  }, [hasAddress, user]);

  if (!open) return null;

  async function handleSubmit(event) {
    event.preventDefault();
    if (!form.full_address.trim()) {
      setError("Введите адрес доставки.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const nextUser = await updateProfileAddress(form);
      onSaved(nextUser);
      toast.success("Адрес сохранен");
      setOpen(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-slate-950/30 px-3 pb-3 backdrop-blur-sm">
      <motion.form
        initial={{ y: 48, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        onSubmit={handleSubmit}
        className="glass w-full rounded-3xl p-5"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <div className="mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-tomato text-white">
              <MapPin size={22} />
            </div>
            <h2 className="text-xl font-black text-ink">Куда доставить?</h2>
            <p className="mt-1 text-sm text-slate-500">Адрес сохранится в профиле.</p>
          </div>
          {hasAddress ? (
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="grid h-10 w-10 place-items-center rounded-full bg-white text-slate-500 shadow-sm"
              aria-label="Закрыть"
            >
              <X size={18} />
            </button>
          ) : null}
        </div>

        <div className="space-y-3">
          <input
            value={form.full_address}
            onChange={(event) => setForm((current) => ({ ...current, full_address: event.target.value }))}
            placeholder="Улица, дом"
            className="w-full rounded-2xl border border-orange-100 bg-white/90 px-4 py-3 outline-none focus:border-tomato"
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
          <input
            value={form.phone}
            onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
            placeholder="Телефон"
            className="w-full rounded-2xl border border-orange-100 bg-white/90 px-4 py-3 outline-none focus:border-tomato"
          />
          <textarea
            value={form.comment}
            onChange={(event) => setForm((current) => ({ ...current, comment: event.target.value }))}
            placeholder="Комментарий к адресу"
            rows={2}
            className="w-full resize-none rounded-2xl border border-orange-100 bg-white/90 px-4 py-3 outline-none focus:border-tomato"
          />
        </div>

        {error ? <p className="mt-3 text-sm font-semibold text-tomato">{error}</p> : null}

        <button
          type="submit"
          disabled={saving}
          className="mt-4 w-full rounded-2xl bg-ink px-5 py-4 font-black text-white shadow-glow disabled:opacity-60"
        >
          {saving ? "Сохраняем..." : "Сохранить адрес"}
        </button>
      </motion.form>
    </div>
  );
}
