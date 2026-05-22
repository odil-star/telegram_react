const BACKEND_URL = (import.meta.env.VITE_API_URL || "https://telegram-django.onrender.com").replace(/\/$/, "");
const API_BASE = BACKEND_URL.endsWith("/api") ? BACKEND_URL : `${BACKEND_URL}/api`;
const USER_KEY = "fastfood:user";

let csrfTokenCache = "";

function getCookie(name) {
  const cookie = document.cookie
    .split(";")
    .map((cookie) => cookie.trim())
    .find((item) => item.startsWith(`${name}=`));
  return cookie ? decodeURIComponent(cookie.split("=").slice(1).join("=")) : "";
}

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

async function parseResponse(response) {
  return response.json().catch(() => null);
}

export async function getCsrfToken() {
  const response = await fetch(`${API_BASE}/csrf/`, {
    headers: { Accept: "application/json" },
    credentials: "include",
  });
  const data = await parseResponse(response);
  if (!response.ok) {
    throw new Error(data?.message || `API error ${response.status}`);
  }
  csrfTokenCache = data?.csrfToken || getCookie("csrftoken") || csrfTokenCache;
  return csrfTokenCache;
}

export async function apiRequest(endpoint, options = {}) {
  const { method = "GET", body, isFormData = false } = options;
  const headers = {
    Accept: "application/json",
    ...(options.headers || {}),
  };
  const upperMethod = method.toUpperCase();

  const storedUser = getStoredUser();
  if (storedUser?.telegram_id) {
    headers["X-Telegram-Id"] = storedUser.telegram_id;
  }
  if (body && !isFormData) {
    headers["Content-Type"] = "application/json";
  }
  if (["POST", "PATCH", "PUT", "DELETE"].includes(upperMethod)) {
    headers["X-CSRFToken"] = await getCsrfToken();
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: upperMethod,
    headers,
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
    credentials: "include",
  });
  const data = await parseResponse(response);

  if (!response.ok) {
    const message =
      data?.message ||
      data?.detail ||
      data?.non_field_errors?.[0] ||
      data?.items?.[0] ||
      `API error ${response.status}`;
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

export const adminLogin = (payload) => apiRequest("/admin/login/", { method: "POST", body: payload });
export const adminMe = () => apiRequest("/admin/me/");
export const adminLogout = () => apiRequest("/admin/logout/", { method: "POST" });
export const adminDashboard = () => apiRequest("/admin/dashboard/");
export const adminOrders = (status) => apiRequest(`/admin/orders/${status ? `?status=${status}` : ""}`);
export const adminUpdateOrderStatus = (id, nextStatus) =>
  apiRequest(`/admin/orders/${id}/status/`, { method: "PATCH", body: { status: nextStatus } });
export const adminProducts = () => apiRequest("/admin/products/");
export const adminCategories = () => apiRequest("/admin/categories/");
export const adminLeads = () => apiRequest("/admin/leads/");
export const adminUpdateLead = (id, payload) => apiRequest(`/admin/leads/${id}/`, { method: "PATCH", body: payload });
export const adminUsers = () => apiRequest("/admin/users/");
export const adminCreateUser = (payload) => apiRequest("/admin/users/", { method: "POST", body: payload });
export const adminTasks = () => apiRequest("/admin/tasks/");
export const adminCreateTask = (payload) => apiRequest("/admin/tasks/", { method: "POST", body: payload });
export const adminUpdateTask = (id, payload) => apiRequest(`/admin/tasks/${id}/`, { method: "PATCH", body: payload });
export const trackVisit = (payload) => apiRequest("/analytics/visit/", { method: "POST", body: payload });

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
    isFormData: true,
  });
}

export const adminDeleteProduct = (id) => apiRequest(`/admin/products/${id}/`, { method: "DELETE" });
export const adminSaveCategory = (category, id) =>
  apiRequest(`/admin/categories/${id ? `${id}/` : ""}`, {
    method: id ? "PATCH" : "POST",
    body: category,
  });
export const adminDeleteCategory = (id) => apiRequest(`/admin/categories/${id}/`, { method: "DELETE" });
