// Base URL til Web API'et kommer fra .env (VITE_API_BASE)
const API = import.meta.env.VITE_API_BASE;

// Hjælpefunktion til at bygge en fuld image-url
export function imgSrc(url) {
  return url ? `${API}${url}` : "";
}

// Lille helper som laver fetch + JSON + simpel fejl-håndtering
function fetchJson(path) {
  return fetch(`${API}${path}`).then((res) => {
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    return res.json();
  });
}

// ---------- GET endpoints ----------

// Hent alle kategorier
export function getCategories() {
  return fetchJson("/api/Categories");
}

// Hent produkter med pagination
export function getProducts(page = 1, pageSize = 12) {
  return fetchJson(`/api/Products?page=${page}&pageSize=${pageSize}`);
}

// Hent et enkelt produkt via id
export function getProduct(id) {
  return fetchJson(`/api/Products/${id}`);
}

// Hent produkter for en kategori
export function getProductsByCategory(categoryId) {
  return fetchJson(`/api/Categories/${categoryId}/products`);
}
