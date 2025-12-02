"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import ProductCard, { Product } from "@/components/ProductCard";

export default function ProductosPage() {
  const [productos, setProductos] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await api.get("/api/publicaciones");
        setProductos(res.data);
      } catch (error) {
        console.error("Error cargando productos", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">
              Marketplace de{" "}
              <span className="text-emerald-400">UnicorMarket</span>
            </h1>
            <p className="text-slate-400 mt-1">
              Explora todos los productos publicados por estudiantes Unicor.
            </p>
          </div>
        </header>

        {loading ? (
          <p className="text-slate-400">Cargando productos...</p>
        ) : productos.length === 0 ? (
          <p className="text-slate-400">
            Aún no hay productos publicados. ¡Sé el primero en publicar! 🙌
          </p>
        ) : (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {productos.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
