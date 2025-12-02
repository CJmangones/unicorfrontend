"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);
  }, [pathname]);

  const handleLogout = () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("accessToken");
    router.push("/");
    router.refresh?.();
  };

  const linkClasses = (href: string) =>
    `rounded-full px-4 py-1.5 text-sm ${
      pathname === href
        ? "bg-slate-800 text-slate-50"
        : "text-slate-300 hover:bg-slate-800/70 hover:text-slate-50"
    }`;

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* 👇 LOGO CLICKEABLE QUE VA A "/" */}
        <Link href="/" className="flex items-center gap-3">
          <div className="relative h-9 w-9">
            <Image
              src="/logo-unicormarket.png"
              alt="UnicorMarket"
              fill
              className="rounded-full object-contain"
            />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-emerald-400">
              UnicorMarket
            </span>
            <span className="text-[11px] text-slate-400">
              Trueques y ventas entre estudiantes
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <Link href="/productos" className={linkClasses("/productos")}>
            Productos
          </Link>

          {isLoggedIn ? (
            <>
              <Link href="/trueques" className={linkClasses("/trueques")}>
                Trueques
              </Link>
              <Link href="/ordenes" className={linkClasses("/ordenes")}>
                Órdenes
              </Link>
              <Link href="/perfil" className={linkClasses("/perfil")}>
                Mi perfil
              </Link>
              <button
                onClick={handleLogout}
                className="ml-2 rounded-full bg-slate-800 px-4 py-1.5 text-sm font-medium text-slate-50 hover:bg-slate-700"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className={linkClasses("/login")}>
                Iniciar sesión
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-emerald-500 px-4 py-1.5 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
