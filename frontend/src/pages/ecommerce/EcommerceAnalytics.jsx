// src/pages/ecommerce/EcommerceAnalytics.jsx
/**
 * ECOMMERCE ANALYTICS (Demo)
 * -------------------------------------------------------
 * ✅ Objetivo:
 * - Mostrar un resumen ejecutivo del e-commerce:
 *   - compras/ventas del mes
 *   - ahorro estimado
 *   - cumplimiento promedio
 * - Sección de insights (texto) para decisiones rápidas.
 *
 * ✅ Theme:
 * - NO se define fondo aquí (lo maneja theme global + EcomLayout).
 * - Usamos tokens del sistema:
 *   - bg-surface, text-text, text-muted, border-border, ring-ring, shadow-pro, bg-accent.
 * - Evitamos clases hardcoded:
 *   - bg-black/*, text-white/*, border-white/*, etc.
 */

import React from "react";
import EcomLayout from "./_EcomLayout";

export default function EcommerceAnalytics() {
  // ✅ Data demo (luego: backend)
  const stats = [
    { label: "Compras (mes)", value: "12", hint: "Transacciones confirmadas" },
    { label: "Ventas (mes)", value: "7", hint: "Órdenes cerradas" },
    { label: "Ahorro estimado", value: "USD $4,250", hint: "Por comparación proveedores" },
    { label: "Cumplimiento promedio", value: "91%", hint: "Score logístico/comercial" },
  ];

  // ✅ Insights demo (luego: generado por analytics real)
  const insights = [
    "Mejor categoría del mes: Madera (alta demanda)",
    "Proveedor top: cumplimiento +95%",
    "Mayor ahorro: comparador activado en 60% de órdenes",
    "Oportunidad: activar logística estimada por API",
  ];

  return (
    <EcomLayout title="Analytics" subtitle="Resumen ejecutivo del e-commerce (demo).">
      {/* KPIs */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <KpiCard key={s.label} label={s.label} value={s.value} hint={s.hint} />
        ))}
      </section>

      {/* Insights */}
      <section className="rounded-3xl border border-border bg-surface/60 backdrop-blur-xl shadow-pro p-6 text-text">
        <div className="font-extrabold">Insights (demo)</div>

        <ul className="mt-3 text-sm text-muted grid gap-2 md:grid-cols-2">
          {insights.map((t) => (
            <li key={t} className="flex items-start gap-2">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent" />
              <span className="text-text/85">{t}</span>
            </li>
          ))}
        </ul>

        <div className="mt-5 rounded-2xl border border-border bg-surface/40 p-4 text-xs text-muted">
          Nota: Este módulo es demostrativo. Luego conectamos métricas reales (órdenes, ahorro, cumplimiento, tiempos de entrega).
        </div>
      </section>
    </EcomLayout>
  );
}

/* -------------------- UI -------------------- */

function KpiCard({ label, value, hint }) {
  return (
    <div className="rounded-3xl border border-border bg-surface/60 backdrop-blur-xl shadow-pro p-6 text-text">
      <div className="text-muted text-xs">{label}</div>
      <div className="text-text font-extrabold text-3xl mt-2">{value}</div>
      <div className="text-muted text-xs mt-2">{hint}</div>
    </div>
  );
}