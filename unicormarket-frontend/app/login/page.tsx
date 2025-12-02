"use client";

import { FormEvent, useState } from "react";
import { api, setAuthToken } from "@/lib/api";
import { useRouter } from "next/navigation";

const token = localStorage.getItem("token");

export default function LoginPage() {
  const router = useRouter();
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const res = await api.post("/api/auth/login", {
        correo_institucional: correo,
        password,
      });

      const { token, user } = res.data;
      localStorage.setItem("accessToken", token);
      localStorage.setItem("user", JSON.stringify(user));
      setAuthToken(token);
      router.push("/");
    } catch (error: any) {
      console.error(error);
      const msg =
        error?.response?.data?.message || "Error al iniciar sesión";
      setErrorMsg(msg);
    }
  };

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="max-w-md mx-auto rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
        <h1 className="text-2xl font-bold mb-4">Iniciar sesión</h1>
        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div>
            <label className="block mb-1 text-slate-300">
              Correo institucional
            </label>
            <input
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              type="email"
              className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2"
              placeholder="tucorreo@correo.unicordoba.edu.co"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-slate-300">Contraseña</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2"
              required
            />
          </div>

          {errorMsg && (
            <p className="text-red-400 text-xs mt-1">{errorMsg}</p>
          )}

          <button
            type="submit"
            className="mt-2 w-full rounded-lg bg-emerald-500 py-2 font-semibold text-slate-950 hover:bg-emerald-400"
          >
            Entrar
          </button>
        </form>
      </div>
    </main>
  );
}
