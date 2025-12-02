import Link from "next/link";

export interface Product {
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

export default function ProductCard({ product }: { product: Product }) {
  const firstImage = product.imagenes?.[0];

  return (
    <article className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden hover:-translate-y-1 transition-transform">
      <div className="aspect-[4/3] bg-slate-800">
        {firstImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={firstImage}
            alt={product.titulo}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-500 text-sm">
            Sin foto
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col gap-1">
        <h2 className="font-semibold text-base line-clamp-1">
          {product.titulo}
        </h2>
        <p className="text-sm text-slate-400 line-clamp-2">
          {product.descripcion}
        </p>

        <div className="flex items-center justify-between mt-3">
          <span className="font-semibold text-emerald-400">
            {product.modalidad === "donacion"
              ? "Donación"
              : product.precio !== null
              ? `$${product.precio}`
              : "A convenir"}
          </span>
          {product.categoria_nombre && (
            <span className="text-xs px-2 py-1 rounded-full bg-slate-800 text-slate-300">
              {product.categoria_nombre}
            </span>
          )}
        </div>

        <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
          <span>{product.usuario_nombre}</span>
          <Link
            href={`/productos/${product.id}`}
            className="text-emerald-400 hover:text-emerald-300"
          >
            Ver detalle
          </Link>
        </div>
      </div>
    </article>
  );
}
