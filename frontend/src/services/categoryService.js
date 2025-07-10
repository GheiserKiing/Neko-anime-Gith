// File: frontend/src/services/categoryService.js

// Hardcodeamos la base para evitar problemas de entorno
const API_BASE = "http://localhost:4000";

/**
 * Hace una petición fetch tipificada.
 * @param {string} path Ruta dentro del API, e.g. '/api/categories'
 * @param {object|string} body Cuerpo de la petición: objeto o string
 * @param {object} options Opciones adicionales de fetch
 */
async function doFetch(path, body = null, options = {}) {
  const url = `${API_BASE}${path}`; // este cambio es para usar siempre la URL base correcta
  const fetchOptions = { ...options };

  if (body != null) {
    // este cambio es para aceptar both string y objeto
    const payload = typeof body === "string"
      ? { name: body }                 // este cambio es para envolver string en objeto { name }
      : body;                          // si ya es objeto, lo usamos directamente

    fetchOptions.headers = {
      ...(fetchOptions.headers || {}),
      "Content-Type": "application/json"
    };
    fetchOptions.body = JSON.stringify(payload); // este cambio es para serializar siempre un objeto válido
  }

  const res = await fetch(url, fetchOptions);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Error ${res.status}`);
  }
  return res.json();
}

// ─── Servicios de categorías ────────────────────────────────────────────

/**
 * Obtiene todas las categorías principales
 */
export function fetchCategories() {
  return doFetch("/api/categories");
}

/**
 * Crea una nueva categoría
 * @param {{ name: string } | string} category Objeto con name o string simple
 */
export function createCategory(category) {
  return doFetch("/api/categories", category, { method: "POST" }); // este cambio es para soportar string y objeto
}

/**
 * Actualiza una categoría existente
 * @param {number} id
 * @param {{ name: string } | string} category Objeto con name o string simple
 */
export function updateCategory(id, category) {
  return doFetch(`/api/categories/${id}`, category, { method: "PUT" }); // este cambio es para soportar string y objeto
}

/**
 * Elimina una categoría
 * @param {number} id
 */
export function deleteCategory(id) {
  return doFetch(`/api/categories/${id}`, null, { method: "DELETE" });
}

/**
 * Obtiene subcategorías de una categoría dada
 * @param {number} categoryId
 */
export function fetchSubcategories(categoryId) {
  return doFetch(`/api/categories/${categoryId}/subcategories`);
}

/**
 * Crea una subcategoría bajo una categoría
 * @param {number} categoryId
 * @param {{ name: string } | string} subcategory Objeto con name o string simple
 */
export function createSubcategory(categoryId, subcategory) {
  return doFetch(
    `/api/categories/${categoryId}/subcategories`,
    subcategory,
    { method: "POST" }
  ); // este cambio es para soportar string y objeto
}

/**
 * Actualiza una subcategoría
 * @param {number} categoryId
 * @param {number} subcategoryId
 * @param {{ name: string } | string} subcategory Objeto con name o string simple
 */
export function updateSubcategory(categoryId, subcategoryId, subcategory) {
  return doFetch(
    `/api/categories/${categoryId}/subcategories/${subcategoryId}`,
    subcategory,
    { method: "PUT" }
  ); // este cambio es para soportar string y objeto
}

/**
 * Elimina una subcategoría
 * @param {number} categoryId
 * @param {number} subcategoryId
 */
export function deleteSubcategory(categoryId, subcategoryId) {
  return doFetch(
    `/api/categories/${categoryId}/subcategories/${subcategoryId}`,
    null,
    { method: "DELETE" }
  );
}
