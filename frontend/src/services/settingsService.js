const API = process.env.REACT_APP_API_URL || "http://localhost:4000";

/**
 * Obtiene los ajustes del sitio desde el backend.
 * Devuelve un objeto { siteSettings: { heroText, heroSubtext, heroImageUrl, dailyProductId, categoryHeroes, ... } }
 */
export async function fetchSettings() {
  const res = await fetch(`${API}/api/settings`);
  if (!res.ok) {
    throw new Error("Error cargando ajustes");
  }
  return res.json();
}

/**
 * Envía al backend un objeto completo de ajustes para sobrescribir settings.json.
 * Recibe { siteSettings: { heroText, heroSubtext, heroImageUrl, dailyProductId, categoryHeroes, heroPositionX, heroPositionY, heroScale, ... } }
 */
export async function updateSettings(settingsPayload) {
  const res = await fetch(`${API}/api/settings`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(settingsPayload)
  });
  if (!res.ok) {
    throw new Error("Error guardando ajustes");
  }
  return res.json();
}

/**
 * Sube un archivo de imagen para el hero.
 * Convierte la URL absoluta a ruta relativa para que CRA proxy la sirva.
 * Devuelve { url: "/uploads/archivo.jpg" }
 */
export async function uploadHeroImage(file) {
  const fd = new FormData();
  fd.append("hero", file);
  const res = await fetch(`${API}/api/settings/heroImage`, {
    method: "POST",
    body: fd
  });
  if (!res.ok) {
    throw new Error("Error subiendo imagen");
  }
  const { url: absoluteUrl } = await res.json();
  const relativeUrl = new URL(absoluteUrl).pathname;
  return { url: relativeUrl };
}
