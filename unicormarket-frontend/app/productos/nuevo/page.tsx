"use client";

import { FormEvent, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function NuevoProductoPage() {
  const router = useRouter();
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [modalidad, setModalidad] = useState<"venta" | "trueque" | "donacion">(
    "venta",
  );
  const [tipo, setTipo] = useState<"producto" | "servicio">("producto");
  const [facultad, setFacultad] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const imagenUrls: string[] = [];

      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const fileName = `${Date.now()}-${file.name}`;
          const { data, error } = await supabase.storage
            .from("productos")
            .upload(fileName, file);

          if (error) {
            console.error("Error subiendo imagen", error);
            continue;
          }

          const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/productos/${data.path}`;
          imagenUrls.push(publicUrl);
        }
      }

      const token = localStorage.getItem("accessToken");
      if (!token) {
        setErrorMsg("Debes iniciar sesión para publicar.");
        setLoading(false);
        return;
      }

      // Axios ya tiene el token si lo configuraste globalmente, pero enviamos igualmente
      const res = await api.post(
        "/api/publicaciones",
        {
          titulo,
          descripcion,
          precio: precio ? Number(precio) : null,
          categoria_id: categoriaId ? Number(categoriaId) : null,
          modalidad,
          tipo,
          facultad: facultad || null,
          imagenes: imagenUrls,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setSuccessMsg("Publicación creada correctamente 🎉");
      const id = res.data.id;
      setTimeout(() => {
        router.push(`/productos/${id}`);
      }, 1000);
    } catch (error: any) {
      console.error(error);
      const msg =
        error?.response?.data?.message || "Error al crear la publicación";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="max-w-xl mx-auto rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4">
        <h1 className="text-2xl font-bold">Publicar producto</h1>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div>
            <label className="block mb-1 text-slate-300">Título</label>
            <input
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-slate-300">Descripción</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 min-h-[80px]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 text-slate-300">Modalidad</label>
              <select
                value={modalidad}
                onChange={(e) =>
                  setModalidad(e.target.value as "venta" | "trueque" | "donacion")
                }
                className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2"
              >
                <option value="venta">Venta</option>
                <option value="trueque">Trueque</option>
                <option value="donacion">Donación</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-slate-300">Tipo</label>
              <select
                value={tipo}
                onChange={(e) =>
                  setTipo(e.target.value as "producto" | "servicio")
                }
                className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2"
              >
                <option value="producto">Producto</option>
                <option value="servicio">Servicio</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 text-slate-300">Precio</label>
              <input
                type="number"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2"
                disabled={modalidad === "donacion"}
              />
            </div>
            <div>
              <label className="block mb-1 text-slate-300">
                ID categoría (por ahora manual)
              </label>
              <input
                type="number"
                value={categoriaId}
                onChange={(e) => setCategoriaId(e.target.value)}
                className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-slate-300">Facultad</label>
            <input
              value={facultad}
              onChange={(e) => setFacultad(e.target.value)}
              className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 text-slate-300">
              Fotos del producto
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="w-full text-slate-300"
            />
          </div>

          {errorMsg && (
            <p className="text-red-400 text-xs mt-1">{errorMsg}</p>
          )}
          {successMsg && (
            <p className="text-emerald-400 text-xs mt-1">{successMsg}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-lg bg-emerald-500 py-2 font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-60"
          >
            {loading ? "Publicando..." : "Publicar"}
          </button>
        </form>
      </div>
    </main>
  );
}
