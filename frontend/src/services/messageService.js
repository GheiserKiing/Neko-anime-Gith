import axios from "axios";
const API = process.env.REACT_APP_API_URL || "http://localhost:4000";

export function fetchMessages() {
  return axios.get(`${API}/api/messages`).then(res => res.data);
}

export function createMessage(message) {
  return axios.post(`${API}/api/messages`, message).then(res => res.data);
}

export function deleteMessage(id) {
  return axios.delete(`${API}/api/messages/${id}`).then(res => res.data);
}
