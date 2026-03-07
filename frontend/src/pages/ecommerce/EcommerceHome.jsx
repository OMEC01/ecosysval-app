// src/pages/ecommerce/EcommerceHome.jsx
/**
 * ECOMMERCE HOME (Ecosysval)
 * -------------------------------------------------------
 * ✅ Objetivo:
 * - Landing del módulo E-commerce:
 *   - Accesos rápidos: Marketplace, Cotizaciones, Comparador, Analytics.
 *   - Resumen de valor (“qué hace pro”).
 *
 * ✅ IMPORTANTE (THEME + FONDO):
 * - ❌ NO se usa backgroundImage en la página (NO fondo.png aquí).
 * - ✅ El fondo vive globalmente por theme (claro/oscuro) en CSS / App layout.
 * - ✅ EcomLayout solo debe estructurar Header + Sidebar + contenido.
 * - ✅ Aquí agregamos un overlay "glow" suave para contraste,
 *   sin reemplazar ni tapar el fondo.
 *
 * ✅ UI:
 * - Tokens Tailwind: bg-surface, text-text, border-border, ring-ring, bg-accent, shadow-pro.
 * - Gradientes suaves por tarjeta (no hardcode de fondo negro/blanco).
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, BarChart3, Scale, FileText } from "lucide-react";
import EcomLayout from "./_EcomLayout";

export default function EcommerceHome() {
  const navigate = useNavigate();

  /**
   * Cards de navegación (demo).
   * - Mantén `tone` como intención visual (blue/amber/emerald/violet)
   * - El estilo final se calcula por theme con clases neutrales + gradientes suaves.
   */
  const cards = [
    {
      title: "Marketplace B2B",
      desc: "Explora productos/servicios por país, sector, precio y proveedor.",
      icon: <ShoppingCart className="w-5 h-5" />,
      to: "/ecommerce/marketplace",
      tone: "blue",
    },
    {
      title: "Cotizaciones inteligentes",
      desc: "Cotiza por volumen, entrega estimada, tipo de cambio y logística.",
      icon: <FileText className="w-5 h-5" />,
      to: "/ecommerce/cotizaciones",
      tone: "amber",
    },
    {
      title: "Comparador de proveedores",
      desc: "Compara precio, lead time, verificación y cumplimiento.",
      icon: <Scale className="w-5 h-5" />,
      to: "/ecommerce/comparador",
      tone: "emerald",
    },
    {
      title: "Analytics",
      desc: "Resumen de compras, ventas, ahorro y desempeño (demo).",
      icon: <BarChart3 className="w-5 h-5" />,
      to: "/ecommerce/analytics",
      tone: "violet",
    },
  ];

  return (
    <div className="min-h-screen relative">
      {/* ✅ Overlay pro (NO reemplaza fondo global) */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div
          className={[
            "absolute inset-0",
            "bg-[radial-gradient(1200px_600px_at_10%_10%,rgba(236,182,14,0.16),transparent_55%)]",
            "bg-[radial-gradient(900px_450px_at_90%_20%,rgba(59,130,246,0.10),transparent_55%)]",
            "bg-[radial-gradient(900px_450px_at_70%_90%,rgba(16,185,129,0.08),transparent_55%)]",
          ].join(" ")}
        />
      </div>

      <div className="relative z-10">
        <EcomLayout
          title="E-commerce • Marketplace B2B Inteligente"
          subtitle="Compra, vende y negocia con información estratégica (MX • US • CA)."
          rightSlot={
            <button
              onClick={() => navigate("/ecommerce/marketplace")}
              className="rounded-full bg-accent px-5 py-2.5 text-sm font-extrabold text-slate-900 shadow-pro hover:brightness-95 transition"
            >
              Ir al Marketplace
            </button>
          }
        >
          {/* Grid accesos */}
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {cards.map((c) => (
              <button
                key={c.title}
                type="button"
                onClick={() => navigate(c.to)}
                className={[
                  "text-left rounded-3xl border border-border bg-surface/60 backdrop-blur-xl shadow-pro p-5",
                  "hover:bg-surface/75 hover:-translate-y-0.5 transition",
                  "text-text relative overflow-hidden",
                ].join(" ")}
              >
                {/* Glow decorativo */}
                <div className={glowByTone(c.tone)} />

                <div className={iconWrapByTone(c.tone)}>
                  <div className="text-text/90">{c.icon}</div>
                </div>

                <div className="mt-4">
                  <div className="font-extrabold">{c.title}</div>
                  <div className="text-muted text-sm mt-1">{c.desc}</div>
                </div>
              </button>
            ))}
          </section>

          {/* Value props */}
          <section className="rounded-3xl border border-border bg-surface/60 backdrop-blur-xl shadow-pro p-6 text-text">
            <div className="font-extrabold">Qué hace “pro” este E-commerce</div>

            <ul className="mt-3 grid gap-2 md:grid-cols-2 text-sm text-muted">
              <li className="flex items-start gap-2">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent" />
                <span className="text-text/85">Cotización por volumen + logística estimada</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent" />
                <span className="text-text/85">Comparador de proveedores con cumplimiento</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent" />
                <span className="text-text/85">Multi-país y multi-moneda (MXN/USD/CAD)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent" />
                <span className="text-text/85">Base para crédito, pagos y tracking (fase 2)</span>
              </li>
            </ul>
          </section>
        </EcomLayout>
      </div>
    </div>
  );
}

/* -------------------- UI helpers -------------------- */

/**
 * Wrapper del ícono con gradiente suave por “tono”.
 * - Usa tokens neutrales y un “tint” por color para dar personalidad.
 */
function iconWrapByTone(tone) {
  const base = "rounded-2xl p-3 w-fit border border-border bg-surface/50";
  const map = {
    blue: "ring-1 ring-blue-400/20 bg-[linear-gradient(135deg,rgba(59,130,246,0.14),transparent)]",
    amber: "ring-1 ring-amber-400/20 bg-[linear-gradient(135deg,rgba(236,182,14,0.16),transparent)]",
    emerald: "ring-1 ring-emerald-400/20 bg-[linear-gradient(135deg,rgba(16,185,129,0.14),transparent)]",
    violet: "ring-1 ring-violet-400/20 bg-[linear-gradient(135deg,rgba(139,92,246,0.14),transparent)]",
  };
  return `${base} ${map[tone] || map.blue}`;
}

/**
 * Glow decorativo por tarjeta (no interactivo).
 */
function glowByTone(tone) {
  const base = "pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full blur-3xl";
  const map = {
    blue: "bg-blue-400/15",
    amber: "bg-amber-400/18",
    emerald: "bg-emerald-400/15",
    violet: "bg-violet-400/15",
  };
  return `${base} ${map[tone] || map.blue}`;
}