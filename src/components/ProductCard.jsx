import { Plus, Star } from "lucide-react";
import { motion } from "framer-motion";

import { QuantityControl } from "./QuantityControl";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { formatPrice, productPrice } from "../utils/format";

export function ProductCard({ product, compact = false }) {
  const { items, addItem, changeQuantity, removeItem } = useCart();
  const toast = useToast();
  const hasDiscount = Number(product.discount_percent || 0) > 0;
  const cartItem = items.find((item) => item.product.id === product.id);
  const quantity = cartItem?.quantity || 0;

  function handleAdd() {
    addItem(product);
    toast.success("Добавлено в корзину");
  }

  function handleRemove() {
    removeItem(product.id);
    toast.info("Товар удален");
  }

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.99 }}
      className="glass overflow-hidden rounded-3xl"
    >
      <div className={compact ? "flex gap-3 p-3" : ""}>
        <div className={compact ? "h-24 w-24 shrink-0 overflow-hidden rounded-2xl" : "relative h-40 overflow-hidden"}>
          <img
            src={
              product.image_src ||
              product.image_url ||
              "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=900&q=80"
            }
            alt={product.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
          {!compact && product.is_top ? (
            <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-black text-cheese shadow-sm">
              <Star size={13} fill="currentColor" /> Топ
            </span>
          ) : null}
          {!compact && hasDiscount ? (
            <span className="absolute right-3 top-3 rounded-full bg-tomato px-3 py-1 text-xs font-black text-white">
              -{product.discount_percent}%
            </span>
          ) : null}
        </div>

        <div className={compact ? "flex min-w-0 flex-1 flex-col justify-between py-1" : "p-4"}>
          <div>
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-xs font-bold uppercase tracking-wide text-basil">{product.category?.name}</p>
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-xs font-black text-amber-600">
                <Star size={12} fill="currentColor" /> {Number(product.rating || 4.8).toFixed(1)}
              </span>
            </div>
            <h3 className="mt-1 line-clamp-2 text-base font-black text-ink">{product.name}</h3>
            <p className="mt-1 line-clamp-2 text-sm leading-5 text-slate-500">{product.description}</p>
          </div>
          <div className="mt-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-lg font-black text-ink">{formatPrice(productPrice(product))}</p>
              {hasDiscount ? (
                <p className="text-xs font-bold text-slate-400 line-through">{formatPrice(product.price)}</p>
              ) : null}
            </div>
            {quantity > 0 ? (
              <QuantityControl
                quantity={quantity}
                onDecrease={() => changeQuantity(product.id, quantity - 1)}
                onIncrease={handleAdd}
                onRemove={handleRemove}
              />
            ) : (
              <button
                type="button"
                onClick={handleAdd}
                className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-tomato text-white shadow-glow transition active:scale-95"
                aria-label={`Добавить ${product.name}`}
              >
                <Plus size={23} strokeWidth={3} />
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
