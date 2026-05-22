import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

import { EmptyState } from "../components/EmptyState";
import { QuantityControl } from "../components/QuantityControl";
import { useCart } from "../context/CartContext";
import { formatPrice, productPrice } from "../utils/format";

export function Cart() {
  const { items, changeQuantity, removeItem, total } = useCart();

  if (!items.length) {
    return (
      <EmptyState
        title="Корзина пустая"
        text="Добавьте любимые позиции из меню."
        action={
          <Link to="/" className="rounded-2xl bg-ink px-5 py-3 font-black text-white">
            Открыть меню
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-tomato text-white">
          <ShoppingCart size={22} />
        </div>
        <div>
          <h1 className="text-2xl font-black text-ink">Корзина</h1>
          <p className="text-sm font-semibold text-slate-500">{items.length} позиций</p>
        </div>
      </div>

      <div className="space-y-3">
        {items.map(({ product, quantity }) => (
          <article key={product.id} className="glass flex gap-3 rounded-3xl p-3">
            <img
              src={product.image_src || product.image_url}
              alt={product.name}
              className="h-24 w-24 shrink-0 rounded-2xl object-cover"
            />
            <div className="min-w-0 flex-1">
              <h2 className="line-clamp-2 font-black text-ink">{product.name}</h2>
              <p className="mt-1 text-sm font-bold text-slate-500">{formatPrice(productPrice(product))}</p>
              <div className="mt-3 flex items-center justify-between gap-2">
                <QuantityControl
                  quantity={quantity}
                  onDecrease={() => changeQuantity(product.id, quantity - 1)}
                  onIncrease={() => changeQuantity(product.id, quantity + 1)}
                  onRemove={() => removeItem(product.id)}
                />
                <p className="text-sm font-black text-ink">{formatPrice(productPrice(product) * quantity)}</p>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="sticky bottom-24 z-20 glass rounded-3xl p-4">
        <div className="mb-4 flex items-center justify-between">
          <span className="font-bold text-slate-500">Итого</span>
          <span className="text-2xl font-black text-ink">{formatPrice(total)}</span>
        </div>
        <Link
          to="/checkout"
          className="flex w-full items-center justify-center rounded-2xl bg-ink px-5 py-4 font-black text-white shadow-glow"
        >
          Оформить заказ
        </Link>
      </div>
    </div>
  );
}
