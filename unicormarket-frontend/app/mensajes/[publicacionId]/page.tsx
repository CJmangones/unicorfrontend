"use client";

import { useEffect, useState, FormEvent } from "react";
import { api } from "@/lib/api";
import { useParams, useRouter } from "next/navigation";

interface Mensaje {
  id: string;
  publicacion_id: string;
  remitente_id: string;
  destinatario_id: string;
  contenido: string;
  enviado_en: string;
  remitente_nombre: string;
  destinatario_nombre: string;
}

interface Publicacion {
  id: string;
  titulo: string;
  usuario_id: string;
  usuario_nombre: string;
}

interface User {
  id: string;
  nombre: string;
  correo_institucional: string;
}

export default function MensajesPublicacionPage() {
  const { publicacionId } = useParams();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [publicacion, setPublicacion] = useState<Publicacion | null>(null);
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      router.push("/login");
      return;
    }

    const fetchAll = async () => {
      try {
        const [meRes, pubRes, msgRes] = await Promise.all([
          api.get("/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get(`/api/publicaciones/${publicacionId}`),
          api.get(`/api/mensajes/publicacion/${publicacionId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setUser(meRes.data);
        setPublicacion({
          id: pubRes.data.id,
          titulo: pubRes.data.titulo,
          usuario_id: pubRes.data.usuario_id,
          usuario_nombre: pubRes.data.usuario_nombre,
        });
        setMensajes(msgRes.data);
      } catch (error) {
        console.error("Error cargando chat", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [publicacionId, router]);

  const handleEnviar = async (e: FormEvent) => {
    e.preventDefault();
    if (!nuevoMensaje.trim() || !user || !publicacion) return;

    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const res = await api.post(
        "/api/mensajes",
        {
          publicacion_id: publicacion.id,
          destinatario_id: publicacion.usuario_id,
          contenido: nuevoMensaje.trim(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMensajes((prev) => [...prev, res.data]);
      setNuevoMensaje("");
    } catch (error) {
      console.error("Error enviando mensaje", error);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen px-6 py-10">
        <div className="max-w-3xl mx-auto text-slate-400">
          Cargando chat...
        </div>
      </main>
    );
  }

  if (!publicacion || !user) {
    return (
      <main className="min-h-screen px-6 py-10">
        <div className="max-w-3xl mx-auto text-slate-400">
          No se pudo cargar la información del chat.
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="max-w-3xl mx-auto space-y-4">
        <header className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-slate-500">Chat de la publicación</p>
            <button
              onClick={() => router.push(`/productos/${publicacion.id}`)}
              className="text-lg font-semibold text-emerald-400 hover:underline text-left"
            >
              {publicacion.titulo}
            </button>
            <p className="text-xs text-slate-400 mt-1">
              Propietario: {publicacion.usuario_nombre}
            </p>
          </div>
        </header>

        <section className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 flex flex-col gap-3 h-[480px]">
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {mensajes.length === 0 ? (
              <p className="text-xs text-slate-500">
                Aún no hay mensajes. ¡Escribe el primero!
              </p>
            ) : (
              mensajes.map((m) => {
                const esMio = m.remitente_id === user.id;
                return (
                  <div
                    key={m.id}
                    className={`flex ${
                      esMio ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[75%] rounded-2xl px-3 py-2 text-xs ${
                        esMio
                          ? "bg-emerald-500 text-slate-950"
                          : "bg-slate-800 text-slate-100"
                      }`}
                    >
                      <p className="font-semibold text-[11px] mb-0.5">
                        {esMio ? "Tú" : m.remitente_nombre}
                      </p>
                      <p>{m.contenido}</p>
                      <p className="mt-1 text-[10px] opacity-80">
                        {new Date(m.enviado_en).toLocaleString("es-CO", {
                          hour: "2-digit",
                          minute: "2-digit",
                          day: "2-digit",
                          month: "short",
                        })}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <form
            onSubmit={handleEnviar}
            className="flex gap-2 pt-1 border-t border-slate-800"
          >
            <input
              className="flex-1 rounded-full bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-slate-100 outline-none focus:border-emerald-400"
              placeholder="Escribe un mensaje para el propietario..."
              value={nuevoMensaje}
              onChange={(e) => setNuevoMensaje(e.target.value)}
            />
            <button
              type="submit"
              className="rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-emerald-400"
            >
              Enviar
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
