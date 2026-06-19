import React, { useState } from "react";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (name.trim().length < 3) {
      setMessage("El nombre debe tener al menos 3 caracteres.");
      return;
    }
    if (!validateEmail(email)) {
      setMessage("Ingrese un correo válido.");
      return;
    }
    if (password.length < 6) {
      setMessage("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessage("Usuario registrado correctamente!");
        setName(""); setEmail(""); setPassword("");
      } else {
        const errorData = await res.json();
        setMessage(`Error: ${errorData.message || "No se pudo registrar el usuario"}`);
      }
    } catch (error) {
      console.error(error);
      setMessage("Error al conectar con el servidor");
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: "url('/fondo.png')" }}
    >
      {/* OVERLAY OSCURO REAL */}
      <div className="absolute inset-0 bg-black/50 z-0" />

      {/* HEADER */}
      <header className="relative z-10 flex items-center p-6">
        <img
          src="/ecosysval.png"
          alt="ECOSYSVAL"
          className="h-10 w-auto object-contain"
        />
      </header>

      {/* CONTENIDO */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
        <div className="w-full max-w-md rounded-2xl bg-black/30 backdrop-blur-sm border border-white/20 shadow-2xl p-8">
          <h2 className="text-3xl font-bold text-center text-white mb-6">
            Crear cuenta
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Nombre completo */}
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Nombre completo
              </label>
              <input
                type="text"
                placeholder="Escriba su nombre"
                className="w-full px-4 py-2 rounded-lg bg-white text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-yellow-400 outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Correo electrónico */}
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Correo electrónico
              </label>
              <input
                type="email"
                placeholder="correo@empresa.com"
                className="w-full px-4 py-2 rounded-lg bg-white text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-yellow-400 outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Contraseña con ojito */}
            <div className="relative">
              <label className="block text-sm font-medium text-white mb-1">
                Contraseña
              </label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="********"
                className="w-full px-4 py-2 rounded-lg bg-white text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-yellow-400 outline-none pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-slate-700"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            {/* Botón de registro */}
            <button
              type="submit"
              className="w-full bg-yellow-400 text-slate-900 py-2 rounded-lg font-semibold hover:brightness-95 transition"
            >
              Registrarse
            </button>
          </form>

          {message && (
            <p className="text-center text-sm text-red-300 mt-4">
              {message}
            </p>
          )}

          <p className="text-center text-sm text-white mt-6">
            ¿Ya tienes cuenta?{" "}
            <a 
              href="/login" 
              className="text-yellow-300 hover:underline"
            >
              Inicia sesión
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;