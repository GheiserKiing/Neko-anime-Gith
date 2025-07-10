// File: frontend/src/services/authService.js

// Servicio para login y gestión de token JWT en localStorage

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";
const TOKEN_KEY = "nekoshop_token";

/**
 * Hace login y guarda el token en localStorage.
 */
export async function login(username, password) {
  const res = await fetch(`${API_URL}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Error en login");
  }
  const { token } = await res.json();
  localStorage.setItem(TOKEN_KEY, token);
  return token;
}

/**
 * Obtiene el token guardado, o null si no existe.
 */
export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Elimina el token (logout).
 */
export function logout() {
  localStorage.removeItem(TOKEN_KEY);
}
