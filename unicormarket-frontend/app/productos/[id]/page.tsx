"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";

interface PublicacionDetalle {
  id: string;
  titulo: string;
  descripcion: string;
  precio: number | null;
  modalidad: string;
  tipo: string;
  estado: string;
  created_at: string;
  facultad: string | null;
  categoria_id: number | null;
  categoria_nombre: string | null;
  usuario_id: string;
  usuario_nombre: string;
  correo_institucional: string;
  imagenes: string[];
}

export default function PublicacionDetallePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [data, setData] = useState<PublicacionDetalle | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Cargar publicación
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const res = await api.get(`/api/publicaciones/${id}`);
        setData(res.data);
      } catch (error) {
        console.error("Error cargando publicación", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Verificar si hay sesión (token en localStorage)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen px-6 py-10">
        <div className="max-w-4xl mx-auto text-slate-400">
          Cargando publicación...
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen px-6 py-10">
        <div className="max-w-4xl mx-auto text-slate-400">
          Publicación no encontrada.
        </div>
      </main>
    );
  }

  const firstImage = data.imagenes?.[0];

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="max-w-4xl mx-auto grid gap-8 md:grid-cols-[1.3fr,1fr]">
        <section>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 overflow-hidden">
            <div className="aspect-[4/3] bg-slate-800">
              {firstImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={firstImage}
                  alt={data.titulo}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-500 text-sm">
                  Sin foto
                </div>
              )}
            </div>
            {data.imagenes && data.imagenes.length > 1 && (
              <div className="flex gap-2 px-3 py-2 overflow-x-auto border-t border-slate-800">
                {data.imagenes.map((img, idx) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={idx}
                    src={img}
                    alt={`${data.titulo} ${idx + 1}`}
                    className="h-16 w-20 object-cover rounded-md border border-slate-700"
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">
              {data.modalidad} · {data.tipo}
            </p>
            <h1 className="text-2xl font-bold mt-1">{data.titulo}</h1>
            <p className="text-sm text-slate-400 mt-2">{data.descripcion}</p>
          </div>

          <div className="space-y-2">
            <p className="text-2xl font-semibold text-emerald-400">
              {data.modalidad === "donacion"
                ? "Donación"
                : data.precio !== null
                ? `$${data.precio}`
                : "A convenir"}
            </p>
            {data.categoria_nombre && (
              <p className="text-xs text-slate-400">
                Categoría: {data.categoria_nombre}
              </p>
            )}
            {data.facultad && (
              <p className="text-xs text-slate-400">
                Facultad: {data.facultad}
              </p>
            )}
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3 text-sm">
            <p className="font-semibold">{data.usuario_nombre}</p>
            <p className="text-xs text-slate-400">
              Contacto: {data.correo_institucional}
            </p>

            {isLoggedIn && (
              <button
                onClick={() => router.push(`/mensajes/${data.id}`)}
                className="mt-2 inline-flex items-center rounded-full bg-emerald-500 px-4 py-1.5 text-xs font-semibold text-slate-950 hover:bg-emerald-400"
              >
                Abrir chat de la publicación
              </button>
            )}

            {!isLoggedIn && (
              <p className="mt-2 text-[11px] text-slate-500">
                Inicia sesión para chatear con el propietario.
              </p>
            )}
          </div>

          <div className="text-xs text-slate-500">
            Publicado el{" "}
            {new Date(data.created_at).toLocaleString("es-CO", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
