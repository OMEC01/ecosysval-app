// src/pages/Publicaciones.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Image as ImageIcon, Video as VideoIcon, Send, Trash2, X } from "lucide-react";

const LS_KEY = "publicacionesOMEC";

/**
 * Recomendación importante:
 * - localStorage NO es buena opción para videos (se llena muy rápido).
 * - Para MVP: permitir videos solo si son pequeños, o guardar solo metadata y subir a backend después.
 */

const MAX_IMG_BYTES = 1.8 * 1024 * 1024; // ~1.8MB
const MAX_VIDEO_BYTES = 6 * 1024 * 1024; // ~6MB (igual puede llenar LS rápido)

export default function Publicaciones() {
  const [publicaciones, setPublicaciones] = useState([]);
  const [nuevoTexto, setNuevoTexto] = useState("");
  const [imagen, setImagen] = useState(null); // dataURL
  const [video, setVideo] = useState(null); // dataURL

  const imgInputRef = useRef(null);
  const vidInputRef = useRef(null);

  // 🧩 Cargar publicaciones guardadas
  useEffect(() => {
    try {
      const guardadas = JSON.parse(localStorage.getItem(LS_KEY) || "[]");
      setPublicaciones(Array.isArray(guardadas) ? guardadas : []);
    } catch {
      setPublicaciones([]);
    }
  }, []);

  // 💾 Guardar cada vez que cambia la lista
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(publicaciones));
    } catch (e) {
      // Si se llenó el storage, avisamos (suele pasar con videos)
      console.error(e);
      alert("No se pudo guardar: el almacenamiento está lleno. Borra publicaciones o evita videos pesados.");
    }
  }, [publicaciones]);

  const canPublish = useMemo(() => {
    return Boolean(nuevoTexto.trim() || imagen || video);
  }, [nuevoTexto, imagen, video]);

  // ➕ Agregar nueva publicación
  const publicar = () => {
    if (!canPublish) return;

    const nueva = {
      id: Date.now(),
      usuario: "Cristian Alejandro López", // cambia si luego lo traes del perfil
      contenido: nuevoTexto.trim(),
      imagen, // dataURL o null
      video,  // dataURL o null
      fecha: new Date().toLocaleString("es-CO"),
    };

    setPublicaciones((prev) => [nueva, ...prev]);
    limpiarComposer();
  };

  function limpiarComposer() {
    setNuevoTexto("");
    setImagen(null);
    setVideo(null);
    if (imgInputRef.current) imgInputRef.current.value = "";
    if (vidInputRef.current) vidInputRef.current.value = "";
  }

  // 📸 Subir imagen (DataURL)
  const handleImagen = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_IMG_BYTES) {
      alert("La imagen es muy pesada. Usa una menor a ~2MB para este MVP.");
      e.target.value = "";
      return;
    }

    const dataUrl = await readAsDataURL(file);
    setImagen(dataUrl);
    // si cargas imagen, limpiamos video para evitar doble peso
    setVideo(null);
    if (vidInputRef.current) vidInputRef.current.value = "";
  };

  // 🎥 Subir video (DataURL) —⚠️ cuidado con localStorage
  const handleVideo = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_VIDEO_BYTES) {
      alert("El video es muy pesado para guardarlo localmente. Usa uno menor a ~6MB (o conéctalo a backend).");
      e.target.value = "";
      return;
    }

    const dataUrl = await readAsDataURL(file);
    setVideo(dataUrl);
    // si cargas video, limpiamos imagen
    setImagen(null);
    if (imgInputRef.current) imgInputRef.current.value = "";
  };

  const removePub = (id) => {
    setPublicaciones((prev) => prev.filter((p) => p.id !== id));
  };

  const clearAll = () => {
    if (!window.confirm("¿Eliminar todas las publicaciones guardadas?")) return;
    setPublicaciones([]);
    localStorage.removeItem(LS_KEY);
  };

  return (
    <div className="space-y-5">
      {/* ====== Composer / Header ====== */}
      <section className="rounded-3xl border border-border bg-surface/60 backdrop-blur-xl shadow-pro p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs text-muted uppercase tracking-widest">Publicaciones</div>
            <h2 className="text-lg font-extrabold text-text">Comparte novedades con el ecosistema</h2>
            <p className="text-sm text-muted mt-1">
              Agrega texto, una imagen o un video (MVP localStorage).
            </p>
          </div>

          <button
            type="button"
            onClick={clearAll}
            className="inline-flex items-center gap-2 rounded-2xl border border-border bg-surface/40 px-4 py-2 text-xs font-semibold text-text/80 hover:bg-surface transition"
            title="Borrar todo"
          >
            <Trash2 className="w-4 h-4" />
            Limpiar
          </button>
        </div>

        {/* Textarea */}
        <div className="mt-4">
          <textarea
            value={nuevoTexto}
            onChange={(e) => setNuevoTexto(e.target.value)}
            placeholder="¿Qué deseas compartir?"
            className="w-full rounded-2xl border border-border bg-surface/60 px-4 py-3 text-sm text-text placeholder:text-muted outline-none focus:ring-2 focus:ring-ring/60 resize-none"
            rows={4}
          />
        </div>

        {/* Preview */}
        {(imagen || video) && (
          <div className="mt-4 rounded-2xl border border-border bg-surface/40 p-4">
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted font-semibold">Vista previa</div>
              <button
                type="button"
                onClick={() => {
                  setImagen(null);
                  setVideo(null);
                  if (imgInputRef.current) imgInputRef.current.value = "";
                  if (vidInputRef.current) vidInputRef.current.value = "";
                }}
                className="h-9 w-9 rounded-xl border border-border bg-surface/40 hover:bg-surface transition flex items-center justify-center"
                title="Quitar adjunto"
              >
                <X className="w-4 h-4 text-text/80" />
              </button>
            </div>

            {imagen && (
              <img
                src={imagen}
                alt="Preview"
                className="mt-3 w-full max-h-[360px] object-cover rounded-2xl border border-border"
              />
            )}

            {video && (
              <video
                controls
                src={video}
                className="mt-3 w-full rounded-2xl border border-border"
              />
            )}
          </div>
        )}

        {/* Actions bar */}
        <div className="mt-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <label className="inline-flex items-center gap-2 rounded-2xl border border-border bg-surface/40 px-4 py-2 text-xs font-semibold text-text/80 hover:bg-surface transition cursor-pointer">
              <ImageIcon className="w-4 h-4" />
              Imagen
              <input
                ref={imgInputRef}
                type="file"
                accept="image/*"
                onChange={handleImagen}
                className="hidden"
              />
            </label>

            <label className="inline-flex items-center gap-2 rounded-2xl border border-border bg-surface/40 px-4 py-2 text-xs font-semibold text-text/80 hover:bg-surface transition cursor-pointer">
              <VideoIcon className="w-4 h-4" />
              Video
              <input
                ref={vidInputRef}
                type="file"
                accept="video/*"
                onChange={handleVideo}
                className="hidden"
              />
            </label>

            <button
              type="button"
              onClick={limpiarComposer}
              className="inline-flex items-center gap-2 rounded-2xl border border-border bg-surface/40 px-4 py-2 text-xs font-semibold text-text/80 hover:bg-surface transition"
            >
              <Trash2 className="w-4 h-4" />
              Reset
            </button>
          </div>

          <button
            type="button"
            onClick={publicar}
            disabled={!canPublish}
            className={[
              "inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 text-sm font-extrabold shadow-pro transition",
              canPublish
                ? "bg-accent text-slate-900 hover:brightness-95"
                : "bg-surface/50 text-text/40 border border-border cursor-not-allowed",
            ].join(" ")}
          >
            <Send className="w-4 h-4" />
            Publicar
          </button>
        </div>

        <div className="mt-3 text-xs text-muted">
          Tip: Evita videos grandes; localStorage se llena rápido. (Ideal: backend/S3 en fase 2).
        </div>
      </section>

      {/* ====== Lista ====== */}
      <section className="space-y-4">
        {publicaciones.length === 0 ? (
          <div className="rounded-3xl border border-border bg-surface/60 backdrop-blur-xl shadow-pro p-10 text-center">
            <div className="text-4xl mb-3">📝</div>
            <div className="text-text font-bold">Aún no hay publicaciones</div>
            <div className="text-muted text-sm mt-1">Crea la primera arriba.</div>
          </div>
        ) : (
          publicaciones.map((pub) => (
            <article
              key={pub.id}
              className="rounded-3xl border border-border bg-surface/60 backdrop-blur-xl shadow-pro p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src="/omec.png"
                    alt="Perfil"
                    className="w-10 h-10 rounded-2xl border border-border object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <div className="min-w-0">
                    <div className="text-text font-extrabold truncate">{pub.usuario}</div>
                    <div className="text-[11px] text-muted">{pub.fecha}</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removePub(pub.id)}
                  className="h-10 w-10 rounded-2xl border border-border bg-surface/40 hover:bg-surface transition flex items-center justify-center"
                  title="Eliminar publicación"
                >
                  <Trash2 className="w-5 h-5 text-red-400" />
                </button>
              </div>

              {pub.contenido ? (
                <p className="mt-3 text-text/90 text-sm whitespace-pre-wrap leading-relaxed">
                  {pub.contenido}
                </p>
              ) : null}

              {pub.imagen && (
                <img
                  src={pub.imagen}
                  alt="Publicación"
                  className="w-full max-h-[520px] object-cover rounded-2xl mt-4 border border-border"
                />
              )}

              {pub.video && (
                <video
                  controls
                  src={pub.video}
                  className="w-full rounded-2xl mt-4 border border-border"
                />
              )}
            </article>
          ))
        )}
      </section>
    </div>
  );
}

/* ---------- utils ---------- */
function readAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("No se pudo leer el archivo"));
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}