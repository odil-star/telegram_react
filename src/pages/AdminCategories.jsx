import { useEffect, useState } from "react";
import { Edit3, Plus, Trash2 } from "lucide-react";

import { adminCategories, adminDeleteCategory, adminSaveCategory } from "../api/api";
import { AdminNav } from "../components/AdminNav";
import { ErrorBanner } from "../components/ErrorBanner";

const emptyCategory = {
  name: "",
  slug: "",
  image_url: "",
  sort_order: 0,
  is_active: true,
};

export function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyCategory);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      setCategories(await adminCategories());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function reset() {
    setEditingId(null);
    setForm(emptyCategory);
  }

  async function submit(event) {
    event.preventDefault();
    try {
      await adminSaveCategory(form, editingId);
      reset();
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  function edit(category) {
    setEditingId(category.id);
    setForm({
      name: category.name,
      slug: category.slug,
      image_url: category.image_url || "",
      sort_order: category.sort_order,
      is_active: category.is_active,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function remove(id) {
    if (!confirm("Удалить категорию?")) return;
    try {
      await adminDeleteCategory(id);
      setCategories((current) => current.filter((category) => category.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <AdminNav />
      <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[360px_1fr]">
        <form onSubmit={submit} className="glass h-fit space-y-3 rounded-3xl p-5">
          <h1 className="text-2xl font-black text-ink">{editingId ? "Редактировать" : "Новая категория"}</h1>
          <ErrorBanner message={error} />
          <input
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            placeholder="Название"
            className="w-full rounded-2xl border border-orange-100 bg-white/90 px-4 py-3 outline-none focus:border-tomato"
          />
          <input
            value={form.slug}
            onChange={(event) => updateField("slug", event.target.value)}
            placeholder="Slug"
            className="w-full rounded-2xl border border-orange-100 bg-white/90 px-4 py-3 outline-none focus:border-tomato"
          />
          <input
            value={form.image_url}
            onChange={(event) => updateField("image_url", event.target.value)}
            placeholder="URL изображения"
            className="w-full rounded-2xl border border-orange-100 bg-white/90 px-4 py-3 outline-none focus:border-tomato"
          />
          <input
            value={form.sort_order}
            onChange={(event) => updateField("sort_order", event.target.value)}
            type="number"
            placeholder="Порядок"
            className="w-full rounded-2xl border border-orange-100 bg-white/90 px-4 py-3 outline-none focus:border-tomato"
          />
          <label className="block rounded-2xl bg-white/80 p-3 text-sm font-bold text-slate-600">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(event) => updateField("is_active", event.target.checked)}
              className="mr-2"
            />
            Активна
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-ink px-4 py-3 font-black text-white">
              <Plus size={18} /> Сохранить
            </button>
            <button type="button" onClick={reset} className="rounded-2xl bg-white px-4 py-3 font-black text-slate-600">
              Сброс
            </button>
          </div>
        </form>

        <section className="space-y-3">
          <div>
            <h2 className="text-2xl font-black text-ink">Категории</h2>
            <p className="font-semibold text-slate-500">{categories.length} разделов</p>
          </div>
          {loading ? <p className="glass rounded-3xl p-6 font-bold text-slate-500">Загружаем...</p> : null}
          {categories.map((category) => (
            <article key={category.id} className="glass flex items-center gap-3 rounded-3xl p-4">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-cheese/20 text-cheese font-black">
                {category.sort_order}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-lg font-black text-ink">{category.name}</h3>
                <p className="truncate text-sm font-semibold text-slate-500">/{category.slug}</p>
              </div>
              <button
                type="button"
                onClick={() => edit(category)}
                className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-slate-700"
                aria-label="Редактировать"
              >
                <Edit3 size={18} />
              </button>
              <button
                type="button"
                onClick={() => remove(category.id)}
                className="grid h-11 w-11 place-items-center rounded-2xl bg-red-50 text-red-600"
                aria-label="Удалить"
              >
                <Trash2 size={18} />
              </button>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
