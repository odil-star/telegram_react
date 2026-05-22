export function formatPrice(value) {
  const number = Number(value || 0);
  return new Intl.NumberFormat("ru-RU").format(number) + " сум";
}

export function formatDate(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function productPrice(product) {
  return Number(product?.final_price ?? product?.price ?? 0);
}
