// src/components/JobCard.jsx
/**
 * JOB CARD (Ecosysval)
 * -------------------------------------------------------
 * ✅ Objetivo:
 * - Tarjeta reusable para listar vacantes/empleos.
 * - Soporta modo compacto.
 * - Acciones: abrir detalle (onOpen) y aplicar (onApply).
 *
 * ✅ IMPORTANTE (THEME):
 * - Usa tokens: bg-surface, text-text, border-border, ring, shadow-pro.
 * - Evita clases hardcodeadas tipo bg-black / text-white,
 *   para que el componente se adapte a claro/oscuro.
 *
 * ✅ Accesibilidad:
 * - role="button" + tabIndex
 * - Soporta Enter / Espacio para abrir.
 */

import React from "react";
import { MapPin, Briefcase, Clock, Banknote, Building2 } from "lucide-react";

export default function JobCard({ job, onOpen, onApply, compact = false }) {
  const {
    titulo,
    empresa,
    ubicacion,
    salario,
    modalidad,
    tipoContrato,
    tipo_contrato,
    jornada,
    createdAt,
  } = job || {};

  // Normaliza nombre de contrato (backend vs frontend)
  const contrato = tipo_contrato || tipoContrato;

  function open() {
    onOpen?.(job);
  }

  return (
    <article
      className={[
        // Contenedor base (theme tokens)
        "rounded-3xl border border-border bg-surface/60 backdrop-blur-xl shadow-pro",
        "hover:bg-surface/80 hover:-translate-y-0.5 transition",
        "cursor-pointer",
        compact ? "p-4" : "p-5",
      ].join(" ")}
      onClick={open}
      onKeyDown={(e) => {
        // Enter / Space para abrir
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open();
        }
      }}
      role="button"
      tabIndex={0}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-extrabold text-text leading-snug truncate">
            {titulo || "Vacante"}
          </h3>

          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
            <span className="inline-flex items-center gap-1 min-w-0">
              <Building2 className="w-3.5 h-3.5 text-accent shrink-0" />
              <span className="truncate">{empresa || "—"}</span>
            </span>

            <span className="inline-flex items-center gap-1 min-w-0">
              <MapPin className="w-3.5 h-3.5 text-accent shrink-0" />
              <span className="truncate">{ubicacion || "—"}</span>
            </span>
          </div>
        </div>

        {/* Modalidad pill (theme-aware) */}
        <span className="shrink-0 rounded-full bg-accent/15 px-3 py-1 text-[11px] font-semibold text-text border border-border">
          {modalidad || "—"}
        </span>
      </div>

      {/* Info chips */}
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        <div className={chipCls}>
          <Banknote className="w-4 h-4 text-accent" />
          <span className="truncate text-text/90">{salario || "Salario a convenir"}</span>
        </div>

        <div className={chipCls}>
          <Briefcase className="w-4 h-4 text-accent" />
          <span className="truncate text-text/90">{contrato || "—"}</span>
        </div>

        <div className={chipCls}>
          <Clock className="w-4 h-4 text-accent" />
          <span className="truncate text-text/90">{jornada || "—"}</span>
        </div>

        <div className={chipCls}>
          <span className="text-muted">Publicado:</span>
          <span className="truncate text-text/90">
            {createdAt ? new Date(createdAt).toLocaleString("es-CO") : "—"}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={(e) => {
            // Evita disparar el onOpen del contenedor
            e.stopPropagation();
            onApply?.(job);
          }}
          className={[
            "rounded-2xl bg-accent px-4 py-2 text-xs font-extrabold text-slate-900",
            "shadow-pro hover:brightness-95 transition",
          ].join(" ")}
        >
          Aplicar
        </button>
      </div>
    </article>
  );
}

/**
 * Chip base: usa tokens del theme.
 * - bg-surface/40 + border-border para adaptarse a dark/light.
 */
const chipCls =
  "inline-flex items-center gap-2 rounded-2xl bg-surface/40 px-3 py-2 border border-border text-text";