"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Si ya está logueado, redirigir (opcional)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("accessToken");
    if (token) {
      // Ya hay sesión, puedes redirigir si quieres
      // router.push("/");
    }
  }, [router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const res = await api.post("/api/auth/login", {
        correo_institucional: correo,
        password,
      });

      const { token, user } = res.data;

      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", token);
        localStorage.setItem("user", JSON.stringify(user));
      }

      router.push("/");
    } catch (error: any) {
      console.error(error);
      const msg =
        error?.response?.data?.message || "Error al iniciar sesión.";
      setErrorMsg(msg);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-xl border border-slate-800 bg-slate-900/80 p-6 space-y-4"
      >
        <h1 className="text-lg font-semibold text-white">Iniciar sesión</h1>

        <div className="space-y-1 text-sm">
          <label className="text-slate-300">Correo institucional</label>
          <input
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="w-full rounded-md bg-slate-800 px-3 py-2 text-sm text-white outline-none border border-slate-700 focus:border-emerald-500"
            required
          />
        </div>

        <div className="space-y-1 text-sm">
          <label className="text-slate-300">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md bg-slate-800 px-3 py-2 text-sm text-white outline-none border border-slate-700 focus:border-emerald-500"
            required
          />
        </div>

        {errorMsg && (
          <p className="text-xs text-red-400 mt-1">{errorMsg}</p>
        )}

        <button
          type="submit"
          className="w-full mt-2 rounded-md bg-emerald-500 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
        >
          Iniciar sesión
        </button>
      </form>
    </main>
  );
}
