"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

interface Orden {
  id: string;
  publicacion_id: string;
  comprador_id: string;
  vendedor_id: string;
  cantidad: number;
  monto_total: number;
  estado: string;
  creada_en: string;
  titulo: string;
  comprador_nombre: string;
  vendedor_nombre: string;
}

export default function OrdenesPage() {
  const router = useRouter();
  const [ordenes, setOrdenes] = useState<Orden[]>([]);
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

    const fetchOrdenes = async () => {
      try {
        const res = await api.get("/api/ordenes/mias", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrdenes(res.data);
      } catch (error) {
        console.error("Error obteniendo órdenes", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrdenes();
  }, [router]);

  if (loading) {
    return (
      <main className="min-h-screen px-6 py-10">
        <div className="max-w-5xl mx-auto text-slate-400">
          Cargando órdenes...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="max-w-5xl mx-auto space-y-4">
        <header>
          <h1 className="text-2xl font-bold">Mis órdenes</h1>
          <p className="text-xs text-slate-400">
            Compras y ventas que has realizado en UnicorMarket.
          </p>
        </header>

        {ordenes.length === 0 ? (
          <p className="text-sm text-slate-400">
            Aún no tienes órdenes registradas.
          </p>
        ) : (
          <div className="space-y-3">
            {ordenes.map((o) => (
              <div
                key={o.id}
                className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
              >
                <div>
                  <button
                    onClick={() =>
                      router.push(`/productos/${o.publicacion_id}`)
                    }
                    className="text-sm font-semibold text-emerald-400 hover:underline text-left"
                  >
                    {o.titulo}
                  </button>
                  <p className="text-xs text-slate-400 mt-1">
                    Cantidad: {o.cantidad} · Monto total: ${o.monto_total}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Comprador: {o.comprador_nombre} · Vendedor:{" "}
                    {o.vendedor_nombre}
                  </p>
                </div>

                <div className="text-right text-xs space-y-1">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 font-medium ${
                      o.estado === "completada"
                        ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/40"
                        : o.estado === "cancelada"
                        ? "bg-rose-500/15 text-rose-300 border border-rose-500/40"
                        : "bg-amber-500/10 text-amber-300 border border-amber-500/30"
                    }`}
                  >
                    {o.estado}
                  </span>
                  <div className="text-slate-500">
                    {new Date(o.creada_en).toLocaleString("es-CO", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
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
