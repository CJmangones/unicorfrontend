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

interface UsuarioLocal {
  id: string;
  nombre?: string;
  correo_institucional?: string;
}

export default function PublicacionDetallePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [data, setData] = useState<PublicacionDetalle | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mensajeOrden, setMensajeOrden] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<UsuarioLocal | null>(null);

  // Estado para "pasarela" de compra
  const [showCheckout, setShowCheckout] = useState(false);
  const [cantidad, setCantidad] = useState(1);
  const [creatingOrder, setCreatingOrder] = useState(false);

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

  // Verificar sesión y usuario actual
  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);

    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const parsed = JSON.parse(userStr);
        setCurrentUser(parsed);
      } catch {
        // ignore
      }
    }
  }, []);

  const isOwner = !!currentUser && !!data && currentUser.id === data.usuario_id;

  // Lógica para crear orden (usada por la "pasarela")
  const handleCrearOrden = async (cantOrden: number): Promise<boolean> => {
    try {
      setMensajeOrden(null);

      if (!data) {
        setMensajeOrden("No se encontró la publicación");
        return false;
      }

      if (typeof window === "undefined") {
        setMensajeOrden("No se pudo acceder al navegador");
        return false;
      }

      const token = localStorage.getItem("accessToken");

      if (!token) {
        setMensajeOrden("Debes iniciar sesión para comprar este producto");
        return false;
      }

      setCreatingOrder(true);

      const res = await api.post(
        "/api/ordenes",
        {
          publicacion_id: data.id,
          cantidad: cantOrden,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status !== 201) {
        setMensajeOrden(
          (res.data as any)?.message || "No se pudo crear la orden"
        );
        return false;
      }

      setMensajeOrden("Orden creada correctamente ✅");
      return true;
    } catch (error: any) {
      console.error("Error creando orden:", error);
      const msg =
        error?.response?.data?.message ||
        "Error al crear la orden. Intenta de nuevo.";
      setMensajeOrden(msg);
      return false;
    } finally {
      setCreatingOrder(false);
    }
  };

  // Confirmar compra desde el modal
  const handleConfirmarCompra = async () => {
    if (!data) return;
    const success = await handleCrearOrden(cantidad);
    if (success) {
      setShowCheckout(false);
      // si quieres, redirige a /ordenes:
      // router.push("/ordenes");
    }
  };

  // Eliminar publicación (solo dueño)
  const handleEliminarPublicacion = async () => {
    if (!data) return;

    const seguro = window.confirm(
      "¿Seguro que deseas eliminar esta publicación? Esta acción no se puede deshacer."
    );
    if (!seguro) return;

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("Debes iniciar sesión.");
        return;
      }

      await api.delete(`/api/publicaciones/${data.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Publicación eliminada correctamente.");
      router.push("/productos");
    } catch (error: any) {
      console.error("Error eliminando publicación:", error);
      alert(
        error?.response?.data?.message ||
          "Error al eliminar la publicación. Intenta de nuevo."
      );
    }
  };

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
  const precioUnitario = data.precio ?? 0;
  const totalEstimado = precioUnitario * cantidad;

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
              <>
                <button
                  onClick={() => router.push(`/mensajes/${data.id}`)}
                  className="mt-2 inline-flex items-center rounded-full bg-emerald-500 px-4 py-1.5 text-xs font-semibold text-slate-950 hover:bg-emerald-400"
                >
                  Abrir chat de la publicación
                </button>

                {/* Botón tipo "pasarela" */}
                {data.modalidad !== "donacion" && data.precio !== null && (
                  <button
                    onClick={() => setShowCheckout(true)}
                    className="mt-3 inline-flex items-center rounded-full bg-blue-500 px-4 py-1.5 text-xs font-semibold text-slate-950 hover:bg-blue-400"
                  >
                    Comprar producto
                  </button>
                )}

                {/* Botones solo para el dueño */}
                {isOwner && (
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => router.push(`/productos/editar/${data.id}`)}
                      className="inline-flex items-center rounded-full bg-slate-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-slate-500"
                    >
                      Editar publicación
                    </button>
                    <button
                      onClick={handleEliminarPublicacion}
                      className="inline-flex items-center rounded-full bg-red-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-red-500"
                    >
                      Eliminar
                    </button>
                  </div>
                )}
              </>
            )}

            {!isLoggedIn && (
              <p className="mt-2 text-[11px] text-slate-500">
                Inicia sesión para chatear o comprar este producto.
              </p>
            )}

            {mensajeOrden && (
              <p className="mt-2 text-[11px] text-slate-300">{mensajeOrden}</p>
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

      {/* Modal "pasarela de pago" */}
      {showCheckout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 p-5 space-y-4">
            <h2 className="text-lg font-semibold text-white">
              Confirmar compra
            </h2>

            <p className="text-sm text-slate-300">{data.titulo}</p>

            <div className="flex items-center justify-between text-sm text-slate-300">
              <span>Precio unitario:</span>
              <span>
                {precioUnitario > 0 ? `$${precioUnitario}` : "A convenir"}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm text-slate-300">
              <span>Cantidad:</span>
              <input
                type="number"
                min={1}
                value={cantidad}
                onChange={(e) =>
                  setCantidad(Math.max(1, Number(e.target.value) || 1))
                }
                className="w-20 rounded-md bg-slate-800 border border-slate-600 px-2 py-1 text-right text-sm text-white"
              />
            </div>

            <div className="flex items-center justify-between text-sm text-slate-300">
              <span>Total estimado:</span>
              <span>
                {precioUnitario > 0 ? `$${totalEstimado}` : "A convenir"}
              </span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowCheckout(false)}
                className="rounded-full bg-slate-700 px-4 py-1.5 text-xs font-semibold text-slate-100 hover:bg-slate-600"
                disabled={creatingOrder}
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmarCompra}
                className="rounded-full bg-emerald-500 px-4 py-1.5 text-xs font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-60"
                disabled={creatingOrder}
              >
                {creatingOrder ? "Procesando..." : "Confirmar compra"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
