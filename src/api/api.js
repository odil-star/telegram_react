const BACKEND_URL = (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000").replace(/\/$/, "");
const API_URL = BACKEND_URL.endsWith("/api") ? BACKEND_URL : `${BACKEND_URL}/api`;
const USER_KEY = "fastfood:user";
const ADMIN_TOKEN_KEY = "fastfood:admin-token";

export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || "null");
  } catch {
    return null;
  }
}

export function saveStoredUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getAdminToken() {
  return localStorage.getItem(ADMIN_TOKEN_KEY) || import.meta.env.VITE_ADMIN_TOKEN || "dev-admin-token";
}

export function setAdminToken(token) {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

async function parseResponse(response) {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function apiRequest(endpoint, options = {}) {
  const { method = "GET", body, admin = false, isFormData = false } = options;
  const headers = {
    Accept: "application/json",
  };

  const storedUser = getStoredUser();
  if (storedUser?.telegram_id) {
    headers["X-Telegram-Id"] = storedUser.telegram_id;
  }
  if (admin) {
    headers["X-Admin-Token"] = getAdminToken();
  }
  if (body && !isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers,
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
  });
  const data = await parseResponse(response);

  if (!response.ok) {
    const message = data?.detail || data?.non_field_errors?.[0] || data?.items?.[0] || "Ошибка API";
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export async function telegramAuth(payload) {
  const data = await apiRequest("/telegram/auth/", { method: "POST", body: payload });
  saveStoredUser(data.user);
  return data.user;
}

export const getProfile = () => apiRequest("/profile/");
export const updateProfileAddress = (payload) =>
  apiRequest("/profile/address/", { method: "PATCH", body: payload }).then((user) => {
    saveStoredUser(user);
    return user;
  });

export const getCategories = () => apiRequest("/categories/");
export const getProducts = (params = {}) => {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== "" && value !== "all")
  ).toString();
  return apiRequest(`/products/${query ? `?${query}` : ""}`);
};
export const getTopProducts = () => apiRequest("/products/top/");
export const getPromoProducts = () => apiRequest("/promos/");
export const createOrder = (payload) => apiRequest("/orders/", { method: "POST", body: payload });
export const getMyOrders = () => apiRequest("/orders/my/");
export const getOrder = (id) => apiRequest(`/orders/${id}/`);

export const adminDashboard = () => apiRequest("/admin/dashboard/", { admin: true });
export const adminOrders = (status) => apiRequest(`/admin/orders/${status ? `?status=${status}` : ""}`, { admin: true });
export const adminUpdateOrderStatus = (id, nextStatus) =>
  apiRequest(`/admin/orders/${id}/status/`, { method: "PATCH", body: { status: nextStatus }, admin: true });
export const adminProducts = () => apiRequest("/admin/products/", { admin: true });
export const adminCategories = () => apiRequest("/admin/categories/", { admin: true });

export function adminSaveProduct(product, id) {
  const formData = new FormData();
  [
    "category_id",
    "name",
    "description",
    "price",
    "image_url",
    "is_top",
    "is_promo",
    "discount_percent",
    "is_active",
  ].forEach((key) => {
    if (product[key] !== undefined && product[key] !== null) {
      formData.append(key, product[key]);
    }
  });
  if (product.image instanceof File) {
    formData.append("image", product.image);
  }
  return apiRequest(`/admin/products/${id ? `${id}/` : ""}`, {
    method: id ? "PATCH" : "POST",
    body: formData,
    admin: true,
    isFormData: true,
  });
}

export const adminDeleteProduct = (id) =>
  apiRequest(`/admin/products/${id}/`, { method: "DELETE", admin: true });
export const adminSaveCategory = (category, id) =>
  apiRequest(`/admin/categories/${id ? `${id}/` : ""}`, {
    method: id ? "PATCH" : "POST",
    body: category,
    admin: true,
  });
export const adminDeleteCategory = (id) =>
  apiRequest(`/admin/categories/${id}/`, { method: "DELETE", admin: true });
