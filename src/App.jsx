import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { CartProvider } from "./context/CartContext";
import { ToastProvider } from "./context/ToastContext";
import { AppLayout } from "./layouts/AppLayout";
import { AdminCategories } from "./pages/AdminCategories";
import { AdminDashboard } from "./pages/AdminDashboard";
import { AdminOrders } from "./pages/AdminOrders";
import { AdminProducts } from "./pages/AdminProducts";
import { Cart } from "./pages/Cart";
import { Categories } from "./pages/Categories";
import { Checkout } from "./pages/Checkout";
import { Menu } from "./pages/Menu";
import { Orders } from "./pages/Orders";
import { Profile } from "./pages/Profile";

export default function App() {
  return (
    <CartProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route index element={<Menu />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/categories" element={<AdminCategories />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </CartProvider>
  );
}
