// File: frontend/src/services/dropshipService.js
export function importDropshipProducts(products) {
  return fetch("/api/dropship/import", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ products })
  }).then(res => {
    if (!res.ok) throw new Error(`${res.status}: ${res.statusText}`);
    return res.json();
  });
}
