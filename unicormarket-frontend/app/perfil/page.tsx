"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import ProductCard, { Product } from "@/components/ProductCard";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  correo_institucional: string;
  nombre: string;
  facultad: string | null;
  telefono: string | null;
  rol: string;
  reputacion: number | null;
  created_at: string;
}

export default function PerfilPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [publicaciones, setPublicaciones] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = typeof window !== "undefined"
      ? localStorage.getItem("accessToken")
      : null;

    if (!token) {
      router.push("/login");
      return;
    }

    const fetchAll = async () => {
      try {
        const [meRes, pubsRes] = await Promise.all([
          api.get("/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get("/api/usuarios/me/publicaciones", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setUser(meRes.data);
        setPublicaciones(pubsRes.data);
      } catch (error) {
        console.error("Error cargando perfil", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [router]);

  if (loading) {
    return (
      <main className="min-h-screen px-6 py-10">
        <div className="max-w-6xl mx-auto text-slate-400">
          Cargando perfil...
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen px-6 py-10">
        <div className="max-w-6xl mx-auto text-slate-400">
          Debes iniciar sesión para ver tu perfil.
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="max-w-6xl mx-auto grid gap-8 md:grid-cols-[1.1fr,1.7fr]">
        <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-3">
          <div>
            <h1 className="text-2xl font-bold mb-1">Perfil de usuario</h1>
            <p className="text-xs text-slate-400">
              Información vinculada a tu cuenta institucional.
            </p>
          </div>

          <div className="space-y-1 text-sm">
            <p className="font-semibold">{user.nombre}</p>
            <p className="text-slate-300">{user.correo_institucional}</p>
            {user.facultad && (
              <p className="text-slate-400 text-xs">
                Facultad: {user.facultad}
              </p>
            )}
            {user.telefono && (
              <p className="text-slate-400 text-xs">Teléfono: {user.telefono}</p>
            )}
          </div>

          <div className="text-xs text-slate-400 pt-2 border-t border-slate-800">
            <p>Rol: {user.rol}</p>
            <p>
              Reputación:{" "}
              {user.reputacion !== null ? `${user.reputacion}/5` : "Sin valoraciones"}
            </p>
            <p>
              Miembro desde{" "}
              {new Date(user.created_at).toLocaleDateString("es-CO", {
                year: "numeric",
                month: "short",
                day: "2-digit",
              })}
            </p>
          </div>
        </section>

        <section>
          <header className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold">
                Mis publicaciones ({publicaciones.length})
              </h2>
              <p className="text-xs text-slate-400">
                Son visibles en el marketplace de UnicorMarket.
              </p>
            </div>
          </header>

          {publicaciones.length === 0 ? (
            <p className="text-sm text-slate-400">
              Aún no has publicado nada. Ve a{" "}
              <span className="font-semibold text-emerald-400">
                Publicar &gt; Producto
              </span>{" "}
              para crear tu primera publicación.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {publicaciones.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
