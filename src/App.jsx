import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { CartProvider } from "./context/CartContext";
import { ToastProvider } from "./context/ToastContext";
import { AdminGuard } from "./components/AdminGuard";
import { AppLayout } from "./layouts/AppLayout";
import { AdminCategories } from "./pages/AdminCategories";
import { AdminDashboard } from "./pages/AdminDashboard";
import { AdminLeads } from "./pages/AdminLeads";
import { AdminLogin } from "./pages/AdminLogin";
import { AdminOrders } from "./pages/AdminOrders";
import { AdminProducts } from "./pages/AdminProducts";
import { AdminTasks } from "./pages/AdminTasks";
import { AdminUsers } from "./pages/AdminUsers";
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
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <Routes>
            <Route element={<AppLayout />}>
              <Route index element={<Menu />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
              <Route path="/admin/leads" element={<AdminGuard><AdminLeads /></AdminGuard>} />
              <Route path="/admin/tasks" element={<AdminGuard><AdminTasks /></AdminGuard>} />
              <Route path="/admin/users" element={<AdminGuard><AdminUsers /></AdminGuard>} />
              <Route path="/admin/orders" element={<AdminGuard><AdminOrders /></AdminGuard>} />
              <Route path="/admin/products" element={<AdminGuard><AdminProducts /></AdminGuard>} />
              <Route path="/admin/categories" element={<AdminGuard><AdminCategories /></AdminGuard>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </CartProvider>
  );
}
