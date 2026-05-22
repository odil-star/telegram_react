import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { CreditCard, MapPin, MessageSquareText, Phone } from "lucide-react";

import { createOrder } from "../api/api";
import { ErrorBanner } from "../components/ErrorBanner";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { formatPrice } from "../utils/format";

const deliveryOptions = [
  ["delivery", "Доставка"],
  ["pickup", "Самовывоз"],
];

const paymentOptions = [
  ["cash", "Наличные"],
  ["card_on_delivery", "Карта при получении"],
  ["online_later", "Онлайн оплата позже"],
];

export function Checkout() {
  const { user } = useOutletContext();
  const { items, total, clearCart } = useCart();
  const toast = useToast();
  const navigate = useNavigate();
  const [deliveryMethod, setDeliveryMethod] = useState("delivery");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setAddress(user?.address?.full_address || "");
    setPhone(user?.phone || "");
  }, [user]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!items.length) {
      navigate("/cart");
      return;
    }
    if (deliveryMethod === "delivery" && !address.trim()) {
      setError("Введите адрес для доставки.");
      return;
    }
    if (!phone.trim()) {
      setError("Введите номер телефона.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await createOrder({
        delivery_method: deliveryMethod,
        payment_method: paymentMethod,
        address: deliveryMethod === "delivery" ? address : "",
        phone,
        comment,
        items: items.map((item) => ({ product_id: item.product.id, quantity: item.quantity })),
      });
      clearCart();
      toast.success("Заказ оформлен");
      navigate("/orders");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-ink">Оформление</h1>
        <p className="mt-1 text-sm font-semibold text-slate-500">{formatPrice(total)}</p>
      </div>
      <ErrorBanner message={error} />

      <section className="glass rounded-3xl p-4">
        <h2 className="mb-3 font-black text-ink">Способ получения</h2>
        <div className="grid grid-cols-2 gap-2">
          {deliveryOptions.map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setDeliveryMethod(value)}
              className={[
                "rounded-2xl px-4 py-3 text-sm font-black transition",
                deliveryMethod === value ? "bg-ink text-white" : "bg-white/80 text-slate-600",
              ].join(" ")}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      {deliveryMethod === "delivery" ? (
        <label className="glass block rounded-3xl p-4">
          <span className="mb-2 flex items-center gap-2 font-black text-ink">
            <MapPin size={18} /> Адрес
          </span>
          <textarea
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            rows={3}
            className="w-full resize-none rounded-2xl border border-orange-100 bg-white/90 px-4 py-3 outline-none focus:border-tomato"
          />
        </label>
      ) : null}

      <label className="glass block rounded-3xl p-4">
        <span className="mb-2 flex items-center gap-2 font-black text-ink">
          <Phone size={18} /> Телефон
        </span>
        <input
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          className="w-full rounded-2xl border border-orange-100 bg-white/90 px-4 py-3 outline-none focus:border-tomato"
        />
      </label>

      <section className="glass rounded-3xl p-4">
        <h2 className="mb-3 flex items-center gap-2 font-black text-ink">
          <CreditCard size={18} /> Оплата
        </h2>
        <div className="space-y-2">
          {paymentOptions.map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setPaymentMethod(value)}
              className={[
                "flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-black transition",
                paymentMethod === value ? "bg-ink text-white" : "bg-white/80 text-slate-600",
              ].join(" ")}
            >
              {label}
              <span className="h-3 w-3 rounded-full bg-current" />
            </button>
          ))}
        </div>
      </section>

      <label className="glass block rounded-3xl p-4">
        <span className="mb-2 flex items-center gap-2 font-black text-ink">
          <MessageSquareText size={18} /> Комментарий
        </span>
        <textarea
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          rows={3}
          placeholder="Например: без лука"
          className="w-full resize-none rounded-2xl border border-orange-100 bg-white/90 px-4 py-3 outline-none focus:border-tomato"
        />
      </label>

      <button
        type="submit"
        disabled={saving || !items.length}
        className="w-full rounded-2xl bg-tomato px-5 py-4 font-black text-white shadow-glow disabled:opacity-60"
      >
        {saving ? "Отправляем..." : "Заказать"}
      </button>
    </form>
  );
}
