import { useEffect, useMemo, useState } from "react";
import { Search, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useOutletContext } from "react-router-dom";

import { getCategories, getProducts, getPromoProducts, getTopProducts } from "../api/api";
import { CategoryTabs } from "../components/CategoryTabs";
import { ErrorBanner } from "../components/ErrorBanner";
import { ProductCard } from "../components/ProductCard";
import { SectionHeader } from "../components/SectionHeader";
import { SkeletonCard } from "../components/SkeletonCard";

export function Menu() {
  const { user, authError } = useOutletContext();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [promos, setPromos] = useState({ banners: [], products: [] });
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    async function loadInitial() {
      setLoading(true);
      setError("");
      try {
        const [categoryData, topData, promoData] = await Promise.all([
          getCategories(),
          getTopProducts(),
          getPromoProducts(),
        ]);
        if (!alive) return;
        setCategories(categoryData);
        setTopProducts(topData);
        setPromos(promoData);
      } catch (err) {
        if (alive) setError(err.message);
      } finally {
        if (alive) setLoading(false);
      }
    }
    loadInitial();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    let alive = true;
    const timer = setTimeout(async () => {
      setError("");
      try {
        const data = await getProducts({ category: activeCategory, search });
        if (alive) setProducts(data);
      } catch (err) {
        if (alive) setError(err.message);
      }
    }, 180);
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [activeCategory, search]);

  const firstName = useMemo(() => user?.first_name || user?.username || "гость", [user]);

  return (
    <div className="space-y-5">
      <ErrorBanner message={authError || error} />

      <section className="relative overflow-hidden rounded-3xl bg-ink p-5 text-white shadow-soft">
        <img
          src="https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=80"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />
        <div className="relative z-10">
          <p className="text-sm font-semibold text-orange-100">Привет, {firstName}</p>
          <h1 className="mt-1 text-3xl font-black leading-tight">Горячее меню уже здесь</h1>
          <div className="mt-5 flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-ink">
            <Search size={20} className="shrink-0 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Найти бургер, пиццу, напиток"
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>
        </div>
      </section>

      <CategoryTabs categories={categories} active={activeCategory} onChange={setActiveCategory} />

      {promos.banners?.length ? (
        <div className="scrollbar-hide -mx-4 flex gap-3 overflow-x-auto px-4">
          {promos.banners.map((banner) => (
            <motion.article
              key={banner.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative h-32 w-72 shrink-0 overflow-hidden rounded-3xl bg-ink text-white shadow-soft"
            >
              <img src={banner.image_url} alt={banner.title} className="absolute inset-0 h-full w-full object-cover opacity-55" />
              <div className="relative z-10 flex h-full flex-col justify-end p-4">
                <span className="mb-2 inline-flex w-fit items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-black text-tomato">
                  <Sparkles size={13} /> Акция
                </span>
                <h2 className="text-lg font-black">{banner.title}</h2>
                <p className="line-clamp-1 text-sm text-orange-50">{banner.subtitle}</p>
              </div>
            </motion.article>
          ))}
        </div>
      ) : null}

      {topProducts.length ? (
        <section>
          <SectionHeader title="Топ товары" />
          <div className="grid grid-cols-1 gap-3">
            {topProducts.slice(0, 3).map((product) => (
              <ProductCard key={product.id} product={product} compact />
            ))}
          </div>
        </section>
      ) : null}

      <section>
        <SectionHeader title={search ? "Результаты" : "Меню"} />
        {loading && !products.length ? (
          <div className="grid grid-cols-1 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
        {!loading && products.length === 0 ? (
          <p className="rounded-3xl bg-white/70 p-6 text-center text-sm font-semibold text-slate-500">
            Ничего не найдено.
          </p>
        ) : null}
      </section>
    </div>
  );
}
