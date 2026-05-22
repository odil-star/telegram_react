import { createContext, useContext, useMemo } from "react";

import { useLocalStorage } from "../hooks/useLocalStorage";
import { productPrice } from "../utils/format";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useLocalStorage("fastfood:cart", []);

  function addItem(product) {
    setItems((current) => {
      const found = current.find((item) => item.product.id === product.id);
      if (found) {
        return current.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...current, { product, quantity: 1 }];
    });
  }

  function changeQuantity(productId, quantity) {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems((current) =>
      current.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  }

  function removeItem(productId) {
    setItems((current) => current.filter((item) => item.product.id !== productId));
  }

  function clearCart() {
    setItems([]);
  }

  const summary = useMemo(() => {
    const total = items.reduce((sum, item) => sum + productPrice(item.product) * item.quantity, 0);
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    return { total, count };
  }, [items]);

  const value = {
    items,
    addItem,
    changeQuantity,
    removeItem,
    clearCart,
    total: summary.total,
    count: summary.count,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
}
