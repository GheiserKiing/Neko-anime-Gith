// File: frontend/src/services/supplierService.js
import axios from "axios";

// URL base de tu backend
const BACKEND_URL = process.env.REACT_APP_API_BASE || "http://localhost:4000";
const API = axios.create({ baseURL: BACKEND_URL });

/**
 * Obtiene la lista de proveedores
 */
export const fetchSuppliers = () =>
  API.get("/api/suppliers").then(res => res.data);

/**
 * Crea un nuevo proveedor
 */
export const createSupplier = (supplier) =>
  API.post("/api/suppliers", supplier).then(res => res.data);

/**
 * Actualiza un proveedor existente
 */
export const updateSupplier = (id, data) =>
  API.put(`/api/suppliers/${id}`, data).then(res => res.data);

/**
 * Elimina un proveedor
 */
export const deleteSupplier = (id) =>
  API.delete(`/api/suppliers/${id}`).then(res => res.data);

/**
 * Inicia el flujo OAuth redirigiendo al endpoint de tu backend
 */
export const startSupplierAuth = (id) =>
  `${BACKEND_URL}/api/suppliers/${id}/auth`;

/**
 * Sincroniza el catálogo de un proveedor
 */
export const syncSupplier = (id) =>
  API.post(`/api/suppliers/${id}/sync-products`).then(res => res.data);
