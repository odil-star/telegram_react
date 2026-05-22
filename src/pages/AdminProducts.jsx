import { useEffect, useMemo, useState } from "react";
import { Edit3, ImagePlus, Plus, Trash2 } from "lucide-react";

import {
  adminCategories,
  adminDeleteProduct,
  adminProducts,
  adminSaveProduct,
} from "../api/api";
import { AdminNav } from "../components/AdminNav";
import { ErrorBanner } from "../components/ErrorBanner";
import { formatPrice } from "../utils/format";

const emptyForm = {
  category_id: "",
  name: "",
  description: "",
  price: "",
  image_url: "",
  image: null,
  is_top: false,
  is_promo: false,
  discount_percent: 0,
  is_active: true,
};

export function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const activeCategoryId = useMemo(() => form.category_id || categories[0]?.id || "", [categories, form.category_id]);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const [productData, categoryData] = await Promise.all([adminProducts(), adminCategories()]);
      setProducts(productData);
      setCategories(categoryData);
      setForm((current) => ({ ...current, category_id: current.category_id || categoryData[0]?.id || "" }));
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

  function edit(product) {
    setEditingId(product.id);
    setForm({
      category_id: product.category?.id || "",
      name: product.name,
      description: product.description || "",
      price: product.price,
      image_url: product.image_url || "",
      image: null,
      is_top: product.is_top,
      is_promo: product.is_promo,
      discount_percent: product.discount_percent || 0,
      is_active: product.is_active,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setEditingId(null);
    setForm({ ...emptyForm, category_id: categories[0]?.id || "" });
  }

  async function submit(event) {
    event.preventDefault();
    setError("");
    try {
      await adminSaveProduct({ ...form, category_id: activeCategoryId }, editingId);
      resetForm();
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function remove(productId) {
    if (!confirm("Удалить товар?")) return;
    try {
      await adminDeleteProduct(productId);
      setProducts((current) => current.filter((product) => product.id !== productId));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <AdminNav />
      <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[380px_1fr]">
        <form onSubmit={submit} className="glass h-fit space-y-3 rounded-3xl p-5">
          <h1 className="text-2xl font-black text-ink">{editingId ? "Редактировать товар" : "Новый товар"}</h1>
          <ErrorBanner message={error} />
          <select
            value={activeCategoryId}
            onChange={(event) => updateField("category_id", event.target.value)}
            className="w-full rounded-2xl border border-orange-100 bg-white/90 px-4 py-3 font-bold outline-none"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <input
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            placeholder="Название"
            className="w-full rounded-2xl border border-orange-100 bg-white/90 px-4 py-3 outline-none focus:border-tomato"
          />
          <textarea
            value={form.description}
            onChange={(event) => updateField("description", event.target.value)}
            placeholder="Описание"
            rows={3}
            className="w-full resize-none rounded-2xl border border-orange-100 bg-white/90 px-4 py-3 outline-none focus:border-tomato"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              value={form.price}
              onChange={(event) => updateField("price", event.target.value)}
              placeholder="Цена"
              type="number"
              className="w-full rounded-2xl border border-orange-100 bg-white/90 px-4 py-3 outline-none focus:border-tomato"
            />
            <input
              value={form.discount_percent}
              onChange={(event) => updateField("discount_percent", event.target.value)}
              placeholder="Скидка %"
              type="number"
              min="0"
              max="90"
              className="w-full rounded-2xl border border-orange-100 bg-white/90 px-4 py-3 outline-none focus:border-tomato"
            />
          </div>
          <input
            value={form.image_url}
            onChange={(event) => updateField("image_url", event.target.value)}
            placeholder="URL фото"
            className="w-full rounded-2xl border border-orange-100 bg-white/90 px-4 py-3 outline-none focus:border-tomato"
          />
          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-orange-200 bg-white/80 px-4 py-3 text-sm font-black text-slate-600">
            <ImagePlus size={18} />
            {form.image?.name || "Загрузить фото"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => updateField("image", event.target.files?.[0] || null)}
            />
          </label>
          <div className="grid grid-cols-3 gap-2 text-sm font-bold text-slate-600">
            <label className="rounded-2xl bg-white/80 p-3">
              <input
                type="checkbox"
                checked={form.is_top}
                onChange={(event) => updateField("is_top", event.target.checked)}
                className="mr-2"
              />
              Топ
            </label>
            <label className="rounded-2xl bg-white/80 p-3">
              <input
                type="checkbox"
                checked={form.is_promo}
                onChange={(event) => updateField("is_promo", event.target.checked)}
                className="mr-2"
              />
              Акция
            </label>
            <label className="rounded-2xl bg-white/80 p-3">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(event) => updateField("is_active", event.target.checked)}
                className="mr-2"
              />
              Активен
            </label>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-ink px-4 py-3 font-black text-white">
              <Plus size={18} /> Сохранить
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="rounded-2xl bg-white px-4 py-3 font-black text-slate-600"
            >
              Сброс
            </button>
          </div>
        </form>

        <section className="space-y-3">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-black text-ink">Товары</h2>
              <p className="font-semibold text-slate-500">{products.length} позиций</p>
            </div>
          </div>
          {loading ? <p className="glass rounded-3xl p-6 font-bold text-slate-500">Загружаем...</p> : null}
          {products.map((product) => (
            <article key={product.id} className="glass flex flex-col gap-4 rounded-3xl p-3 sm:flex-row sm:items-center">
              <img
                src={product.image_src || product.image_url}
                alt={product.name}
                className="h-32 w-full rounded-2xl object-cover sm:h-24 sm:w-28"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-black uppercase text-basil">{product.category?.name}</p>
                <h3 className="truncate text-lg font-black text-ink">{product.name}</h3>
                <p className="line-clamp-1 text-sm text-slate-500">{product.description}</p>
                <p className="mt-1 font-black text-ink">{formatPrice(product.final_price || product.price)}</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => edit(product)}
                  className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-slate-700"
                  aria-label="Редактировать"
                >
                  <Edit3 size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => remove(product.id)}
                  className="grid h-11 w-11 place-items-center rounded-2xl bg-red-50 text-red-600"
                  aria-label="Удалить"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
