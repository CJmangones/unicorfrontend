import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen px-6 py-10">
      <div className="max-w-6xl mx-auto grid gap-10 md:grid-cols-[2fr,1.2fr] items-center">
        <section className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Trueques, ventas y donaciones entre{" "}
            <span className="text-emerald-400">estudiantes Unicor</span>
          </h1>
          <p className="text-slate-300 text-sm md:text-base max-w-xl">
            Publica tus libros, calculadoras, apuntes impresos, servicios de
            monitoría y más. Todo dentro de la comunidad de la Universidad de
            Córdoba.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/productos/nuevo"
              className="rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
            >
              Publicar algo
            </Link>
            <Link
              href="/productos"
              className="rounded-full border border-slate-600 px-5 py-2 text-sm text-slate-100 hover:bg-slate-800"
            >
              Ver todo
            </Link>
          </div>

          <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">
            <h2 className="font-semibold mb-1">¿Cómo funciona UnicorMarket?</h2>
            <ol className="list-decimal list-inside space-y-1 text-slate-400">
              <li>Te registras con tu correo @correo.unicordoba.edu.co.</li>
              <li>Publicas lo que quieras vender, cambiar o donar.</li>
              <li>Chateas con otros estudiantes y cierran el acuerdo.</li>
            </ol>
          </div>
        </section>

        <section className="hidden md:block">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 h-full flex flex-col justify-between">
            <div>
              <p className="text-emerald-400 text-sm font-semibold">
                UnicorMarket
              </p>
              <p className="mt-2 text-lg font-semibold">
                Pensado para estudiantes de la Universidad de Córdoba.
              </p>
              <p className="mt-3 text-sm text-slate-400">
                Ahorra dinero, fomenta la economía circular y encuentra lo que
                necesitas dentro del campus.
              </p>
            </div>
            <div className="mt-6 text-xs text-slate-500">
              Proyecto académico · No oficial de la universidad.
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
