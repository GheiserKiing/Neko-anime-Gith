// File: frontend/src/services/productService.js
/**
 * Petición genérica para fetch.
 * Sólo añade Content-Type cuando options.body exista.
 */
async function doFetch(path, options = {}) {
  const fetchOptions = { ...options };
  if (options.body != null) {
    fetchOptions.headers = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    };
  }
  const res = await fetch(path, fetchOptions);         // <-- ruta RELATIVA
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Error ${res.status}`);
  }
  return res.json();
}

/** Obtiene la lista de productos. */
export async function fetchProducts(query = "") {
  try {
    const json = await doFetch(`/api/products${query}`);  // <-- RELATIVO
    return Array.isArray(json.data) ? json.data : [];
  } catch (err) {
    console.error("fetchProducts error:", err);
    return [];
  }
}

/** Obtiene un producto por su ID. */
export async function fetchProductById(id) {
  try {
    return await doFetch(`/api/products/${id}`);         // <-- RELATIVO
  } catch (err) {
    console.error(`fetchProductById(${id}) error:`, err);
    return null;
  }
}

/** Crea un nuevo producto. */
export function createProduct(payload) {
  return doFetch("/api/products", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** Actualiza un producto existente. */
export function updateProduct(id, payload) {
  return doFetch(`/api/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

/** Elimina un producto. */
export function deleteProduct(id) {
  return doFetch(`/api/products/${id}`, { method: "DELETE" });
}

/** Sube o gestiona imágenes de un producto. */
export function uploadProductImages(id, formData) {
  return fetch(`/api/products/${id}/images`, {               // <-- RELATIVO
    method: "POST",
    body: formData,
  }).then((res) => {
    if (!res.ok) throw new Error(`Error ${res.status}`);
    return res.json();
  });
}
