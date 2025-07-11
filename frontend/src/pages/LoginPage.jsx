// File: frontend/src/pages/LoginPage.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

export default function LoginPage({ onLogin }) {
  const [form, setForm] = useState({ user: "", pass: "" });
  const [msg, setMsg]   = useState("");
  const navigate        = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post("/login", {
        user: form.user,
        pass: form.pass,
      });
      localStorage.setItem("token", data.token);
      API.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
      onLogin();
      navigate("/admin");
    } catch {
      setMsg("Credenciales inválidas");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto p-4 border">
      <h2 className="text-xl mb-4">Login Admin</h2>

      <div className="mb-2">
        <label className="block mb-1">Usuario</label>
        <input
          name="user"
          value={form.user}
          onChange={handleChange}
          className="block w-full border px-2 py-1"
          required
        />
      </div>

      <div className="mb-2">
        <label className="block mb-1">Contraseña</label>
        <input
          type="password"
          name="pass"
          value={form.pass}
          onChange={handleChange}
          className="block w-full border px-2 py-1"
          required
        />
      </div>

      <button
        type="submit"
        className="bg-green-500 text-white px-4 py-2 mt-2"
      >
        Entrar
      </button>

      {msg && <p className="mt-2 text-red-500">{msg}</p>}
    </form>
  );
}
