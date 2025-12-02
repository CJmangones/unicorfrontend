"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

interface Trueque {
  id: string;
  estado: string;
  acordado_en: string | null;
  publicacion_id: string;
  titulo: string;
  modalidad: string;
  tipo: string;
  precio: number | null;
  oferente_id: string;
  oferente_nombre: string;
  receptor_id: string;
  receptor_nombre: string;
}

export default function TruequesPage() {
  const router = useRouter();
  const [trueques, setTrueques] = useState<Trueque[]>([]);
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

    const fetchTrueques = async () => {
      try {
        const res = await api.get("/api/trueques/mios", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTrueques(res.data);
      } catch (error) {
        console.error("Error obteniendo trueques", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrueques();
  }, [router]);

  if (loading) {
    return (
      <main className="min-h-screen px-6 py-10">
        <div className="max-w-5xl mx-auto text-slate-400">
          Cargando trueques...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="max-w-5xl mx-auto space-y-4">
        <header>
          <h1 className="text-2xl font-bold">Mis trueques</h1>
          <p className="text-xs text-slate-400">
            Acuerdos de intercambio en los que participas como oferente o
            receptor.
          </p>
        </header>

        {trueques.length === 0 ? (
          <p className="text-sm text-slate-400">
            Aún no tienes trueques registrados. Puedes proponer uno desde el
            detalle de una publicación o coordinando por el chat.
          </p>
        ) : (
          <div className="space-y-3">
            {trueques.map((t) => (
              <div
                key={t.id}
                className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
              >
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    {t.modalidad} · {t.tipo}
                  </p>
                  <button
                    onClick={() =>
                      router.push(`/productos/${t.publicacion_id}`)
                    }
                    className="text-sm font-semibold text-emerald-400 hover:underline text-left"
                  >
                    {t.titulo}
                  </button>
                  <p className="text-xs text-slate-400 mt-1">
                    Precio de referencia:{" "}
                    {t.precio !== null ? `$${t.precio}` : "A convenir"}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Oferente: {t.oferente_nombre} · Receptor: {t.receptor_nombre}
                  </p>
                </div>

                <div className="text-right text-xs space-y-1">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 font-medium ${
                      t.estado === "aceptado"
                        ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/40"
                        : t.estado === "rechazado"
                        ? "bg-rose-500/15 text-rose-300 border border-rose-500/40"
                        : "bg-amber-500/10 text-amber-300 border border-amber-500/30"
                    }`}
                  >
                    {t.estado}
                  </span>
                  <div className="text-slate-500">
                    {t.acordado_en
                      ? `Acordado el ${new Date(
                          t.acordado_en
                        ).toLocaleString("es-CO", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}`
                      : "En negociación"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
