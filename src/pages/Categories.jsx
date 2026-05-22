import { useEffect, useState } from "react";
import { Layers3, Search } from "lucide-react";

import { getCategories, getProducts } from "../api/api";
import { CategoryTabs } from "../components/CategoryTabs";
import { EmptyState } from "../components/EmptyState";
import { ErrorBanner } from "../components/ErrorBanner";
import { ProductCard } from "../components/ProductCard";
import { SkeletonCard } from "../components/SkeletonCard";

export function Categories() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    async function loadCategories() {
      try {
        setCategories(await getCategories());
      } catch (err) {
        if (alive) setError(err.message);
      }
    }
    loadCategories();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    let alive = true;
    const timer = window.setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getProducts({ category: activeCategory, search });
        if (alive) setProducts(data);
      } catch (err) {
        if (alive) setError(err.message);
      } finally {
        if (alive) setLoading(false);
      }
    }, 160);
    return () => {
      alive = false;
      window.clearTimeout(timer);
    };
  }, [activeCategory, search]);

  return (
    <div className="space-y-5">
      <div className="glass rounded-3xl p-5">
        <div className="mb-4 flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-ink text-white">
            <Layers3 size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-ink">Категории</h1>
            <p className="text-sm font-semibold text-slate-500">Быстрый фильтр по меню</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-ink">
          <Search size={20} className="shrink-0 text-slate-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Поиск внутри категории"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
        </div>
      </div>

      <ErrorBanner message={error} />
      <CategoryTabs categories={categories} active={activeCategory} onChange={setActiveCategory} />

      {loading ? (
        <div className="grid grid-cols-1 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      ) : products.length ? (
        <div className="grid grid-cols-1 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <EmptyState title="Ничего не найдено" text="Попробуйте другой запрос или категорию." />
      )}
    </div>
  );
}
