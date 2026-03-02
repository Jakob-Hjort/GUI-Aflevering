const API = import.meta.env.VITE_API_BASE;

async function request(path, options) {
  const res = await fetch(`${API}${path}`, options);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }

  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) return null;
  return await res.json();
}

export const imgSrc = (url) => (url ? `${API}${url}` : "");

// Public
export function getCategories() {
  return request("/api/Categories");
}

export function getProducts(page = 1, pageSize = 12) {
  return request(`/api/Products?page=${page}&pageSize=${pageSize}`);
}

export function getProduct(id) {
  return request(`/api/Products/${id}`);
}

export function getProductsByCategory(categoryId) {
  return request(`/api/Categories/${categoryId}/products`);
}

// Admin
export function createCategory(title) {
  return request("/api/Categories", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
}

export function createProduct({ title, description, price, categoryId }) {
  return request("/api/Products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title,
      description,
      price: Number(price),
      categoryId: Number(categoryId),
    }),
  });
}

export function uploadProductImages(productId, files) {
  const form = new FormData();
  for (const f of files) form.append("files", f);

  return request(`/api/Products/${productId}/images`, {
    method: "POST",
    body: form,
  });
}

export function deleteCategory(id) {
  return request(`/api/Categories/${id}`, { method: "DELETE" });
}

export function deleteProduct(id) {
  return request(`/api/Products/${id}`, { method: "DELETE" });
}

export function deleteProductImage(productId, imageId) {
  return request(`/api/Products/${productId}/images/${imageId}`, { method: "DELETE" });
}