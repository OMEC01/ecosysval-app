// src/pages/Inicio.jsx
import React, { useEffect, useMemo, useState } from "react";
import MainHeader from "../components/MainHeader";
import SidebarMenu from "../components/SidebarMenu";
import { Loader2, RefreshCcw } from "lucide-react";

/**
 * ✅ Inicio.jsx (Feed)
 * ---------------------------------------------------------
 * Objetivo:
 * - Mostrar feed de publicaciones desde backend
 * - Mantener estilo "glass" (cards con blur, bordes y sombra pro)
 * - NO forzar fondo por página (NO usar fondo.png aquí)
 *   El fondo se controla globalmente por ThemeProvider + CSS:
 *   html[data-theme] -> variables (incluyendo --bg-image)
 *
 * Notas importantes:
 * - El overlay decorativo (glow) se agrega como capa extra, sin
 *   reemplazar el background-image global del body.
 * - El backend se toma desde VITE_API_URL para que funcione en otro PC.
 */

// ✅ Base URL del backend (Vite). Si no existe, usa localhost.
const API_BASE = import.meta?.env?.VITE_API_URL || "http://localhost:3000";

export default function Inicio() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  /**
   * Carga el feed desde backend:
   * - GET /posts
   * - Espera un array de posts, si no lo es, se usa []
   */
  const cargarFeed = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/posts`);
      if (!res.ok) throw new Error("No se pudo cargar el feed");

      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Error cargando feed:", e);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Al montar: cargar publicaciones
  useEffect(() => {
    cargarFeed();
  }, []);

  return (
    /**
     * ✅ Importante:
     * - NO background-image aquí.
     * - El fondo depende del tema y está en CSS global (body).
     */
    <div className="min-h-screen flex flex-col relative">
      {/* ✅ Overlay decorativo (glow) SIN reemplazar el fondo global */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div
          className={[
            "absolute inset-0",
            "bg-[radial-gradient(1200px_600px_at_10%_10%,rgba(236,182,14,0.18),transparent_55%)]",
            "bg-[radial-gradient(900px_450px_at_90%_20%,rgba(59,130,246,0.12),transparent_55%)]",
          ].join(" ")}
        />
      </div>

      {/* ✅ App encima del overlay */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <MainHeader />

        <div className="flex flex-1">
          {/* Sidebar */}
          <aside className="hidden md:block w-64">
            <SidebarMenu />
          </aside>

          {/* Main */}
          <main className="flex-1 px-4 md:px-8 py-6">
            <div className="mx-auto max-w-5xl space-y-5">
              {/* Header feed */}
              <div className="flex items-center justify-between gap-3">
                <div className="rounded-3xl border border-border bg-surface/70 backdrop-blur-xl shadow-pro px-5 py-3">
                  <h1 className="text-text font-extrabold text-lg md:text-xl">
                    Inicio
                    <span className="text-muted font-semibold"> • Feed de publicaciones</span>
                  </h1>
                  <p className="text-muted text-sm mt-1">
                    Publicaciones tuyas y de otras empresas (ordenadas por fecha).
                  </p>
                </div>

                <button
                  type="button"
                  onClick={cargarFeed}
                  className="hidden md:inline-flex items-center gap-2 rounded-2xl border border-border bg-surface/50 hover:bg-surface/70 transition px-4 py-3 text-text shadow-pro"
                  title="Actualizar feed"
                >
                  <RefreshCcw className="w-4 h-4" />
                  Actualizar
                </button>
              </div>

              {/* Estados del feed */}
              {loading ? (
                <div className="flex flex-col items-center justify-center p-16 rounded-3xl border border-border bg-surface/60 backdrop-blur-xl shadow-pro">
                  <Loader2 className="w-8 h-8 animate-spin mb-3 text-text" />
                  <div className="text-muted">Cargando publicaciones...</div>
                </div>
              ) : posts.length === 0 ? (
                <div className="rounded-3xl border border-border bg-surface/70 backdrop-blur-xl shadow-pro p-12 text-center">
                  <div className="text-4xl mb-3">📰</div>
                  <p className="text-text font-semibold">Aún no hay publicaciones</p>
                  <p className="text-muted text-sm mt-1">
                    Cuando las empresas publiquen, aparecerán aquí.
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  {posts.map((p) => (
                    <PostCard key={p.id} post={p} apiBase={API_BASE} />
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

/**
 * PostCard
 * ---------------------------------------------------------
 * Renderiza un post individual con:
 * - Autor (avatar + nombre)
 * - Fecha
 * - Texto
 * - Media (imagen y/o video)
 *
 * Recibe apiBase para armar rutas absolutas (API_BASE + path).
 */
function PostCard({ post, apiBase }) {
  const userName =
    post?.user?.name || post?.user?.nombre || post?.user?.empresa || "Empresa";

  // ✅ Fecha del post si viene en createdAt
  const createdAt = useMemo(() => {
    if (!post?.createdAt) return null;
    const d = new Date(post.createdAt);
    return Number.isNaN(d.getTime()) ? null : d;
  }, [post?.createdAt]);

  /**
   * Normaliza una ruta que puede venir:
   * - "/uploads/x.png"
   * - "uploads/x.png"
   * - null
   * y la devuelve como "/uploads/x.png" o null
   */
  const normalizePath = (p) => {
    if (!p || typeof p !== "string") return null;
    return p.startsWith("/") ? p : `/${p}`;
  };

  // ✅ Avatar del autor del post
  const avatarPath = normalizePath(post?.user?.profile_image);

  // ✅ Media del post
  const imgPath = normalizePath(post?.image);
  const videoPath = normalizePath(post?.video);

  return (
    <article className="rounded-3xl border border-border bg-surface/70 backdrop-blur-xl shadow-pro p-5 md:p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="h-11 w-11 rounded-2xl overflow-hidden border border-border bg-surface/50 flex items-center justify-center">
            {avatarPath ? (
              <img
                src={`${apiBase}${avatarPath}`}
                alt={`Avatar ${userName}`}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            ) : (
              <span className="text-text font-extrabold">
                {userName?.[0]?.toUpperCase() || "E"}
              </span>
            )}
          </div>

          <div>
            <div className="font-semibold text-text">{userName}</div>
            <div className="text-xs text-muted">
              {createdAt
                ? createdAt.toLocaleString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : ""}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {post?.content && (
        <p className="text-text/90 mt-4 whitespace-pre-wrap leading-relaxed text-[15px]">
          {post.content}
        </p>
      )}

      {/* Media */}
      {(imgPath || videoPath) && (
        <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-bg/40">
          {imgPath && (
            <img
              src={`${apiBase}${imgPath}`}
              alt="publicación"
              className="w-full max-h-[620px] object-contain block"
              loading="lazy"
            />
          )}

          {videoPath && (
            <video
              src={`${apiBase}${videoPath}`}
              className="w-full max-h-[520px] object-contain block"
              controls
            />
          )}
        </div>
      )}
    </article>
  );
}