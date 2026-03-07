// src/pages/ecommerce/ProductoDetalle.jsx
/**
 * PRODUCTO DETALLE (E-commerce Ecosysval)
 * -------------------------------------------------------
 * ✅ Objetivo:
 * - Mostrar ficha detallada de producto/servicio del Marketplace.
 * - Acciones: generar cotización y checkout (demo).
 * - Panel lateral: info del proveedor y tiempos de entrega.
 *
 * ✅ IMPORTANTE (THEME + FONDO):
 * - ❌ NO usar backgroundImage (NO fondo.png).
 * - ✅ El fondo vive globalmente por tema (claro/oscuro).
 * - ✅ Aquí solo agregamos overlay "glow" suave para contraste.
 *
 * ✅ UI:
 * - Tokens Tailwind: bg-surface, text-text, text-muted, border-border, ring-ring, bg-accent.
 * - Glass: bg-surface/60 + backdrop-blur-xl + shadow-pro.
 */

import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, BadgeCheck, ShieldCheck, FileText, Scale } from "lucide-react";

import EcomLayout from "./_EcomLayout";
import { productosMock } from "../../data/ecommerceMock";
import { useTheme } from "../../components/ThemeProvider";

export default function ProductoDetalle() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { theme } = useTheme(); // (si luego quieres badges por theme)

  const item = useMemo(() => productosMock.find((x) => x.id === id) || null, [id]);

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* ✅ Overlay pro (NO reemplaza fondo global) */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div
          className={[
            "absolute inset-0",
            "bg-[radial-gradient(1100px_520px_at_10%_10%,rgba(236,182,14,0.14),transparent_55%)]",
            "bg-[radial-gradient(900px_450px_at_90%_25%,rgba(59,130,246,0.10),transparent_55%)]",
          ].join(" ")}
        />
      </div>

      <div className="relative z-10">
        {!item ? (
          <EcomLayout title="Producto no encontrado" subtitle="Verifica el ID">
            <div className="rounded-3xl border border-border bg-surface/60 backdrop-blur-xl shadow-pro p-8 text-text">
              <div className="text-sm text-muted">
                No existe el producto/servicio solicitado.
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => navigate("/ecommerce/marketplace")}
                  className="rounded-2xl bg-accent px-5 py-3 font-extrabold text-slate-900 shadow-pro hover:brightness-95 transition"
                >
                  Volver al Marketplace
                </button>

                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="rounded-2xl border border-border bg-surface/60 px-5 py-3 text-sm font-semibold text-text hover:bg-surface transition"
                >
                  Volver atrás
                </button>
              </div>
            </div>
          </EcomLayout>
        ) : (
          <EcomLayout
            title={item.nombre}
            subtitle={`${item.tipo} • ${item.categoria} • ${item.incoterm}`}
            rightSlot={
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="rounded-2xl border border-border bg-surface/60 hover:bg-surface transition px-4 py-3 text-text shadow-pro inline-flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver
              </button>
            }
          >
            <section className="grid gap-4 lg:grid-cols-[1fr_380px]">
              {/* Panel principal */}
              <div className="rounded-3xl border border-border bg-surface/60 backdrop-blur-xl shadow-pro p-6 text-text">
                <div className="text-sm">
                  <span className="font-extrabold text-text">Descripción</span>
                </div>

                <p className="mt-2 text-sm text-text/90 whitespace-pre-wrap leading-relaxed">
                  {item.descripcion}
                </p>

                {/* info básica */}
                <div className="mt-6 grid md:grid-cols-3 gap-3">
                  <Info label="Precio base" value={formatMoney(item.precioBase, item.moneda)} />
                  <Info label="Unidad" value={item.unidad} />
                  <Info label="Stock" value={`${item.stock ?? 0}`} />
                </div>

                {/* chips */}
                <div className="mt-6 flex flex-wrap gap-2">
                  <Chip text={`Rating: ${item.rating ?? "—"}`} />
                  <Chip text={`Incoterm: ${item.incoterm ?? "—"}`} />
                  <Chip text={`País: ${item.pais ?? "—"}`} />
                </div>

                {/* acciones */}
                <div className="mt-8 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => navigate("/ecommerce/cotizaciones", { state: { selectedId: item.id } })}
                    className="rounded-2xl bg-accent px-5 py-3 font-extrabold text-slate-900 shadow-pro hover:brightness-95 transition inline-flex items-center gap-2"
                  >
                    <FileText className="w-5 h-5" />
                    Generar cotización
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/ecommerce/checkout", { state: { selectedId: item.id } })}
                    className="rounded-2xl border border-border bg-surface/60 hover:bg-surface transition px-5 py-3 text-text shadow-pro"
                  >
                    Ir a checkout (mock)
                  </button>
                </div>
              </div>

              {/* Sidebar proveedor */}
              <aside className="rounded-3xl border border-border bg-surface/60 backdrop-blur-xl shadow-pro p-6 h-fit text-text">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-text font-extrabold flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                    Proveedor
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate("/ecommerce/comparador")}
                    className="rounded-2xl border border-border bg-surface/60 hover:bg-surface transition px-3 py-2 text-xs font-semibold text-text inline-flex items-center gap-2"
                    title="Comparar proveedores"
                  >
                    <Scale className="w-4 h-4" />
                    Comparar
                  </button>
                </div>

                <div className="mt-3">
                  <div className="text-text font-extrabold">
                    {item.proveedor?.nombre ?? "—"}{" "}
                    {item.proveedor?.verificado && (
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-500 ml-2">
                        <BadgeCheck className="w-4 h-4" /> Verificado
                      </span>
                    )}
                  </div>

                  <div className="text-muted text-sm mt-1">
                    {item.proveedor?.ciudad ?? "—"}, {item.proveedor?.estado ?? "—"}
                  </div>
                </div>

                <div className="mt-5 grid gap-2">
                  <Info label="Cumplimiento" value={`${item.proveedor?.cumplimiento ?? "—"}%`} />
                  <Info label="Entrega a MX" value={`${item.tiemposEntrega?.MX ?? "—"} días`} />
                  <Info label="Entrega a US" value={`${item.tiemposEntrega?.US ?? "—"} días`} />
                  <Info label="Entrega a CA" value={`${item.tiemposEntrega?.CA ?? "—"} días`} />
                </div>

                <button
                  type="button"
                  onClick={() => navigate("/ecommerce/comparador")}
                  className="mt-6 w-full rounded-2xl border border-border bg-surface/60 hover:bg-surface transition px-5 py-3 text-text shadow-pro"
                >
                  Ver comparador de proveedores
                </button>

                {/* Nota: por si luego quieres usar theme aquí */}
                <div className="mt-4 text-[11px] text-muted">
                  Theme activo: <span className="text-text font-semibold">{theme}</span>
                </div>
              </aside>
            </section>
          </EcomLayout>
        )}
      </div>
    </div>
  );
}

/* ---------------- UI helpers ---------------- */

function Info({ label, value }) {
  return (
    <div className="rounded-2xl border border-border bg-surface/40 px-4 py-3">
      <div className="text-muted text-[11px]">{label}</div>
      <div className="text-text font-extrabold mt-0.5 truncate">{value}</div>
    </div>
  );
}

function Chip({ text }) {
  return (
    <span className="rounded-full border border-border bg-surface/40 px-3 py-1 text-xs text-muted">
      {text}
    </span>
  );
}

function formatMoney(v, currency) {
  try {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(v);
  } catch {
    return `${currency} ${v}`;
  }
}