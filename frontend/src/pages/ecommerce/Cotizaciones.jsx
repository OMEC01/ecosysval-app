// src/pages/ecommerce/Cotizaciones.jsx
/**
 * COTIZACIONES INTELIGENTES (Ecom) - Demo
 * -------------------------------------------------------
 * ✅ Objetivo:
 * - Calcular una cotización estimada por:
 *   - Descuento por volumen (demo)
 *   - Logística estimada + lead time (demo)
 *   - Conversión de moneda (mock FX)
 *
 * ✅ Theme:
 * - No se define fondo aquí (lo maneja theme global + EcomLayout).
 * - Usamos tokens: bg-surface, text-text, text-muted, border-border, ring-ring.
 * - Evitamos: bg-black/*, text-white/*, bg-white/90, border-white/*.
 */

import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FileText, Truck, TrendingUp } from "lucide-react";

import EcomLayout from "./_EcomLayout";
import { FX_MOCK, PAISES, productosMock } from "../../data/ecommerceMock";

export default function Cotizaciones() {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Permite preselección desde marketplace/detalle.
  const preselect = location.state?.selectedId || "";

  const [selectedId, setSelectedId] = useState(preselect);
  const [destino, setDestino] = useState("MX");
  const [cantidad, setCantidad] = useState(10);

  // Producto seleccionado
  const item = useMemo(() => productosMock.find((x) => x.id === selectedId) || null, [selectedId]);

  /**
   * Cálculo de cotización (demo):
   * - descuento por volumen
   * - logística estimada basada en subtotal y lead time
   * - conversión a moneda destino (mock)
   */
  const calc = useMemo(() => {
    if (!item) return null;

    // Descuento por volumen (demo)
    const disc = cantidad >= 100 ? 0.12 : cantidad >= 50 ? 0.08 : cantidad >= 20 ? 0.04 : 0;

    const subtotal = item.precioBase * cantidad * (1 - disc);

    // Logística estimada (demo)
    const lead = item.tiemposEntrega?.[destino] ?? 7;
    const logistics = Math.max(25, subtotal * 0.02) + lead * 3;

    // Conversión de moneda (demo)
    const outCurrency = PAISES.find((p) => p.code === destino)?.currency || "MXN";
    const totalConverted = convert(subtotal + logistics, item.moneda, outCurrency);

    return { disc, subtotal, logistics, lead, outCurrency, totalConverted };
  }, [item, destino, cantidad]);

  return (
    <EcomLayout
      title="Cotizaciones inteligentes"
      subtitle="Volumen + logística + lead time + conversión de moneda (demo)."
      rightSlot={
        <button
          type="button"
          onClick={() => navigate("/ecommerce/marketplace")}
          className={[
            "rounded-2xl px-4 py-3 text-sm font-semibold transition shadow-pro",
            "border border-border bg-surface/60 text-text hover:bg-surface",
          ].join(" ")}
        >
          Volver al Marketplace
        </button>
      }
    >
      <section className="grid gap-4 lg:grid-cols-[1fr_420px]">
        {/* FORM / DETALLE */}
        <div className="rounded-3xl border border-border bg-surface/60 backdrop-blur-xl shadow-pro p-6 text-text">
          <div className="grid gap-3 md:grid-cols-3">
            {/* Producto */}
            <div className="md:col-span-2">
              <label className="text-muted text-xs font-semibold">Producto / Servicio</label>
              <select
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                className={[
                  "mt-1 w-full rounded-2xl px-3 py-2.5 text-sm outline-none transition",
                  "border border-border bg-surface/60 text-text",
                  "focus:ring-2 focus:ring-ring/40",
                ].join(" ")}
              >
                <option value="">Selecciona…</option>
                {productosMock.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre} ({p.moneda})
                  </option>
                ))}
              </select>
            </div>

            {/* Destino */}
            <div>
              <label className="text-muted text-xs font-semibold">Destino</label>
              <select
                value={destino}
                onChange={(e) => setDestino(e.target.value)}
                className={[
                  "mt-1 w-full rounded-2xl px-3 py-2.5 text-sm outline-none transition",
                  "border border-border bg-surface/60 text-text",
                  "focus:ring-2 focus:ring-ring/40",
                ].join(" ")}
              >
                {PAISES.map((p) => (
                  <option key={p.code} value={p.code}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Cantidad */}
            <div>
              <label className="text-muted text-xs font-semibold">Cantidad</label>
              <input
                type="number"
                min={1}
                value={cantidad}
                onChange={(e) => setCantidad(Number(e.target.value || 1))}
                className={[
                  "mt-1 w-full rounded-2xl px-3 py-2.5 text-sm outline-none transition",
                  "border border-border bg-surface/60 text-text",
                  "focus:ring-2 focus:ring-ring/40",
                ].join(" ")}
              />
              <div className="text-muted text-xs mt-1">Descuento demo según volumen.</div>
            </div>
          </div>

          {!item ? (
            <div className="mt-6 text-muted">Selecciona un producto para generar una cotización.</div>
          ) : (
            <div className="mt-6 grid gap-3 md:grid-cols-3">
              <Card label="Precio base" value={formatMoney(item.precioBase, item.moneda)} />
              <Card label="Unidad" value={item.unidad} />
              <Card label="Incoterm" value={item.incoterm} />

              <div className="md:col-span-3 rounded-2xl border border-border bg-surface/40 p-4">
                <div className="text-xs text-muted">Notas</div>
                <div className="mt-1 text-sm text-text/90">
                  Lead time estimado según destino y costo logístico demo. Luego lo conectamos con API real.
                </div>
              </div>

              <div className="md:col-span-3 flex flex-wrap gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => navigate("/ecommerce/checkout", { state: { selectedId: item.id } })}
                  className={[
                    "rounded-2xl px-5 py-3 font-extrabold transition shadow-pro inline-flex items-center gap-2",
                    "bg-accent text-slate-900 hover:brightness-95",
                  ].join(" ")}
                >
                  <FileText className="w-5 h-5" />
                  Continuar a checkout
                </button>

                <button
                  type="button"
                  onClick={() => navigate(`/ecommerce/producto/${item.id}`)}
                  className={[
                    "rounded-2xl px-5 py-3 font-semibold transition shadow-pro",
                    "border border-border bg-surface/60 text-text hover:bg-surface",
                  ].join(" ")}
                >
                  Ver detalle
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RESUMEN */}
        <aside className="rounded-3xl border border-border bg-surface/60 backdrop-blur-xl shadow-pro p-6 h-fit text-text">
          <div className="font-extrabold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-accent" />
            Resumen de cotización
          </div>

          {!calc ? (
            <div className="mt-4 text-muted text-sm">
              Aquí verás el total estimado cuando selecciones un producto.
            </div>
          ) : (
            <div className="mt-4 space-y-3 text-sm">
              <Row label="Descuento por volumen" value={`${Math.round(calc.disc * 100)}%`} />
              <Row label="Subtotal" value={formatMoney(calc.subtotal, item.moneda)} />
              <Row
                label={
                  <span className="inline-flex items-center gap-2">
                    <Truck className="w-4 h-4 text-muted" /> Logística estimada
                  </span>
                }
                value={formatMoney(calc.logistics, item.moneda)}
              />
              <Row label="Lead time" value={`${calc.lead} días`} />

              <div className="h-px bg-border my-2" />

              <Row
                label={<span className="font-extrabold text-text">Total (convertido)</span>}
                value={
                  <span className="font-extrabold text-text">
                    {formatMoney(calc.totalConverted, calc.outCurrency)}
                  </span>
                }
              />

              <div className="rounded-2xl border border-border bg-surface/40 p-4 text-muted text-xs">
                Conversión demo. Luego lo conectamos con tipo de cambio real.
              </div>
            </div>
          )}
        </aside>
      </section>
    </EcomLayout>
  );
}

/* -------------------- UI helpers -------------------- */

function Card({ label, value }) {
  return (
    <div className="rounded-2xl border border-border bg-surface/40 px-4 py-3">
      <div className="text-muted text-[11px]">{label}</div>
      <div className="text-text font-extrabold mt-0.5">{value}</div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="text-muted">{label}</div>
      <div className="text-right text-text/90">{value}</div>
    </div>
  );
}

/* -------------------- Business helpers -------------------- */

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

/**
 * Conversión demo:
 * - Normaliza a USD y luego convierte a destino.
 * - FX_MOCK vive en ecommerceMock.
 */
function convert(amount, from, to) {
  if (from === to) return amount;

  // normalizar a USD
  let usd = amount;
  if (from === "MXN") usd = amount / FX_MOCK.USD_MXN;
  if (from === "CAD") usd = amount / FX_MOCK.USD_CAD;

  // USD a destino
  if (to === "USD") return usd;
  if (to === "MXN") return usd * FX_MOCK.USD_MXN;
  if (to === "CAD") return usd * FX_MOCK.USD_CAD;

  return amount;
}