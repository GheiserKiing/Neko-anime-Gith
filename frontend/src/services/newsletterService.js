// File: frontend/src/services/newsletterService.js
import axios from "axios";
const API = process.env.REACT_APP_API_URL || "http://localhost:4000";

/**
 * Suscribe un email a la newsletter.
 * data = { email, country, interest }
 */
export function subscribeNewsletter(data) {
  return axios
    .post(`${API}/api/newsletter`, data)
    .then(res => res.data);
}

/** Recupera todos los suscriptores */
export function fetchSubscribers() {
  return axios
    .get(`${API}/api/newsletter`)
    .then(res => res.data);
}

/**
 * Envía una campaña segmentada
 * segment = { interest?, country?, domain? }
 * subject = asunto del email
 * body    = cuerpo de texto
 */
export function sendCampaign(segment, subject, body) {
  return axios
    .post(`${API}/api/newsletter/campaign`, { segment, subject, body })
    .then(res => res.data);
}
