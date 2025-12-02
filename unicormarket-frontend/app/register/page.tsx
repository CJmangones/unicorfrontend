"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [facultad, setFacultad] = useState("");
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    // Validación básica del correo institucional
    if (!correo.endsWith("@correo.unicordoba.edu.co")) {
      setErrorMsg("Solo se permiten correos @correo.unicordoba.edu.co");
      return;
    }

    try {
      setLoading(true);

      await api.post("/api/auth/register", {
        nombre,
        correo_institucional: correo,
        facultad,
        telefono: telefono || null,
        password,
      });

      // ✅ Registro OK → ir al login (o al inicio si prefieres)
      router.push("/login");
    } catch (error: any) {
      console.error(error);
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Error al crear la cuenta";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900/80 px-6 py-8 shadow-xl">
        {/* Cabecera con botón para volver al inicio */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Crear cuenta</h1>
            <p className="mt-1 text-xs text-slate-400">
              Solo se permiten correos institucionales @correo.unicordoba.edu.co
            </p>
          </div>

          <Link
            href="/"
            className="text-xs text-emerald-400 hover:text-emerald-300 hover:underline"
          >
            ← Volver al inicio
          </Link>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="text-sm text-slate-200">Nombre completo</label>
            <input
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-emerald-400"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm text-slate-200">Correo institucional</label>
            <input
              type="email"
              required
              placeholder="tucorreo@correo.unicordoba.edu.co"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-emerald-400"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm text-slate-200">Facultad</label>
            <input
              type="text"
              required
              value={facultad}
              onChange={(e) => setFacultad(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-emerald-400"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm text-slate-200">
              Teléfono <span className="text-slate-500">(opcional)</span>
            </label>
            <input
              type="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-emerald-400"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm text-slate-200">Contraseña</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-emerald-400"
            />
          </div>

          {errorMsg && (
            <p className="text-xs text-red-400 mt-1">{errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creando cuenta..." : "Registrarme"}
          </button>

          <p className="text-xs text-slate-400 text-center">
            ¿Ya tienes cuenta?{" "}
            <Link
              href="/login"
              className="text-emerald-400 hover:text-emerald-300 hover:underline"
            >
              Inicia sesión aquí
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
