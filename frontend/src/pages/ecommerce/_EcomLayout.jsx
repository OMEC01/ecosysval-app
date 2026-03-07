// src/pages/ecommerce/_EcomLayout.jsx
/**
 * ECOM LAYOUT (Ecosysval)
 * -------------------------------------------------------
 * ✅ Objetivo:
 * - Layout reutilizable para pantallas de e-commerce.
 * - Incluye: Header global, Sidebar y contenedor central.
 * - Permite inyectar: title, subtitle, rightSlot y children.
 *
 * ✅ IMPORTANTE (THEME + FONDO):
 * - ❌ NO se usa backgroundImage aquí (NO fondo.png).
 * - ✅ El fondo vive globalmente por tema (claro/oscuro) en CSS.
 * - ✅ Este layout solo agrega overlays "glow" sutiles para contraste,
 *   sin reemplazar ni tapar el fondo global.
 *
 * ✅ UI:
 * - Tokens Tailwind: bg-surface, text-text, border-border, ring, shadow-pro, etc.
 */

import React from "react";
import MainHeader from "../../components/MainHeader";
import SidebarMenu from "../../components/SidebarMenu";

export default function EcomLayout({ title, subtitle, rightSlot, children }) {
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* ✅ Overlay pro (NO reemplaza fondo global) */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div
          className={[
            "absolute inset-0",
            "bg-[radial-gradient(1200px_600px_at_10%_10%,rgba(236,182,14,0.16),transparent_55%)]",
            "bg-[radial-gradient(900px_450px_at_90%_20%,rgba(59,130,246,0.12),transparent_55%)]",
          ].join(" ")}
        />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <MainHeader />

        <div className="flex flex-1">
          {/* Sidebar (theme tokens) */}
          <aside className="hidden md:block w-64">
            <SidebarMenu />
          </aside>

          {/* Content */}
          <main className="flex-1 p-6">
            <div className="mx-auto max-w-7xl space-y-5">
              {/* Top bar (Title + Right slot) */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="rounded-3xl border border-border bg-surface/60 backdrop-blur-xl shadow-pro px-6 py-4">
                  <h1 className="text-text font-extrabold text-lg md:text-xl">
                    {title}
                  </h1>

                  {subtitle ? (
                    <p className="text-muted text-sm mt-1">{subtitle}</p>
                  ) : null}
                </div>

                {rightSlot ? (
                  <div className="flex items-center justify-end gap-2">
                    {rightSlot}
                  </div>
                ) : null}
              </div>

              {/* Page content */}
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}