// src/pages/Profile.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  UserCircle,
  Camera,
  Edit,
  Trash2,
  X,
  Image as ImageIcon,
  Video,
  Send,
} from "lucide-react";
import SidebarMenu from "../components/SidebarMenu";
import MainHeader from "../components/MainHeader";

/**
 * ✅ Profile.jsx
 * ---------------------------------------------------------
 * Objetivo:
 * - Mostrar perfil del usuario (banner + avatar)
 * - Permitir subir imagen de perfil y banner
 * - Crear publicaciones (texto + imagen o video)
 * - Listar publicaciones del usuario, con edición y eliminación
 *
 * Estilo:
 * - "Glass UI" consistente con Ajustes / Inicio
 * - NO se fuerza fondo por página (NO usar fondo.png aquí)
 *   El fondo global depende del tema y vive en CSS (body { --bg-image }).
 *
 * Backend:
 * - Se toma de VITE_API_URL para que funcione en otro PC sin tocar el código.
 * - Endpoints usados (según tu código):
 *   GET    /users/:id
 *   PATCH  /users/:id/profile-image
 *   PATCH  /users/:id/banner-image
 *   GET    /posts/user/:id
 *   POST   /posts   (FormData con userId, content y files)
 *   DELETE /posts/:id
 *   PATCH  /posts/:id   (JSON { content })
 */

// ✅ Base URL del backend (Vite). Si no existe, usa localhost.
const API_URL = import.meta?.env?.VITE_API_URL || "http://localhost:3000";

/** Normaliza rutas que pueden venir con o sin "/" inicial */
function normalizePath(p) {
  if (!p || typeof p !== "string") return null;
  return p.startsWith("/") ? p : `/${p}`;
}

export default function Profile() {
  // -----------------------------
  // Estado del usuario + assets
  // -----------------------------
  const [user, setUser] = useState(null);

  // URLs absolutas para renderizar en <img/>
  const [profilePic, setProfilePic] = useState(null);
  const [profileBanner, setProfileBanner] = useState(null);

  // -----------------------------
  // Publicaciones
  // -----------------------------
  const [publicaciones, setPublicaciones] = useState([]);
  const [nuevoTexto, setNuevoTexto] = useState("");

  const [imagenFile, setImagenFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);

  const [imagenPreview, setImagenPreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);

  const [subiendo, setSubiendo] = useState(false);

  // -----------------------------
  // Edición
  // -----------------------------
  const [editandoId, setEditandoId] = useState(null);
  const [textoEditado, setTextoEditado] = useState("");

  // ===============================
  // Cargar usuario + publicaciones
  // ===============================
  useEffect(() => {
    /**
     * El frontend asume que existe:
     * localStorage.getItem("user") con { id, name, ... }
     */
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;

    try {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      if (parsedUser?.id) {
        cargarUsuarioYPublicaciones(parsedUser.id);
      }
    } catch (e) {
      console.error("Usuario en localStorage inválido:", e);
      setUser(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Carga:
   * - usuario (para traer profile_image y banner_image desde backend)
   * - publicaciones del usuario
   */
  const cargarUsuarioYPublicaciones = async (idUsuario) => {
    try {
      // ---- Usuario ----
      const resUser = await fetch(`${API_URL}/users/${idUsuario}`);
      if (!resUser.ok) throw new Error("No se pudo cargar el usuario");
      const dataUser = await resUser.json();

      // profile_image/banner_image deben venir como "/uploads/..."
      const profile = normalizePath(dataUser?.profile_image);
      const banner = normalizePath(dataUser?.banner_image);

      setProfilePic(profile ? `${API_URL}${profile}` : null);
      setProfileBanner(banner ? `${API_URL}${banner}` : null);

      // ---- Posts ----
      const resPosts = await fetch(`${API_URL}/posts/user/${idUsuario}`);
      if (!resPosts.ok) throw new Error("No se pudieron cargar los posts");
      const dataPosts = await resPosts.json();

      setPublicaciones(Array.isArray(dataPosts) ? dataPosts : []);
    } catch (error) {
      console.error("Error al cargar datos del perfil:", error);
    }
  };

  // ===============================
  // Subir imágenes de perfil/banner
  // ===============================
  const handleProfilePicUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${API_URL}/users/${user.id}/profile-image`, {
        method: "PATCH",
        body: formData,
      });

      const data = await response.json();
      if (data?.success) {
        const p = normalizePath(data?.user?.profile_image);
        setProfilePic(p ? `${API_URL}${p}` : null);
      } else {
        console.warn("Respuesta inesperada al subir profile:", data);
      }
    } catch (error) {
      console.error("Error al subir imagen de perfil:", error);
    }
  };

  const handleBannerUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${API_URL}/users/${user.id}/banner-image`, {
        method: "PATCH",
        body: formData,
      });

      const data = await response.json();
      if (data?.success) {
        const b = normalizePath(data?.user?.banner_image);
        setProfileBanner(b ? `${API_URL}${b}` : null);
      } else {
        console.warn("Respuesta inesperada al subir banner:", data);
      }
    } catch (error) {
      console.error("Error al subir imagen de banner:", error);
    }
  };

  // ===============================
  // Crear publicación
  // ===============================
  const publicar = async () => {
    if (!nuevoTexto && !imagenFile && !videoFile) {
      alert("Por favor, agrega texto, imagen o video para publicar");
      return;
    }
    if (!user?.id) return;

    setSubiendo(true);

    const formData = new FormData();
    formData.append("userId", user.id.toString());
    formData.append("content", nuevoTexto || "");

    // ✅ Según tu backend, el campo es "files" (puede aceptar múltiples)
    if (imagenFile) formData.append("files", imagenFile);
    if (videoFile) formData.append("files", videoFile);

    try {
      const res = await fetch(`${API_URL}/posts`, { method: "POST", body: formData });
      const responseData = await res.json().catch(() => ({}));

      if (res.ok) {
        // limpiar editor
        setNuevoTexto("");
        setImagenFile(null);
        setVideoFile(null);
        setImagenPreview(null);
        setVideoPreview(null);

        await cargarUsuarioYPublicaciones(user.id);
      } else {
        alert("Error al crear publicación: " + (responseData.message || "Error desconocido"));
      }
    } catch (error) {
      console.error("Error al publicar:", error);
      alert("Error de conexión al publicar");
    } finally {
      setSubiendo(false);
    }
  };

  // ===============================
  // Eliminar publicación
  // ===============================
  const eliminarPublicacion = async (id) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar esta publicación?")) return;

    try {
      const res = await fetch(`${API_URL}/posts/${id}`, { method: "DELETE" });

      if (res.ok) {
        await cargarUsuarioYPublicaciones(user.id);
      } else {
        alert("Error al eliminar publicación");
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("Error de conexión al eliminar");
    }
  };

  // ===============================
  // Editar publicación
  // ===============================
  const iniciarEdicion = (pub) => {
    setEditandoId(pub.id);
    setTextoEditado(pub.content || "");
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setTextoEditado("");
  };

  const guardarEdicion = async (id) => {
    if (!textoEditado.trim()) {
      alert("El contenido no puede estar vacío");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/posts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: textoEditado }),
      });

      if (res.ok) {
        setEditandoId(null);
        setTextoEditado("");
        await cargarUsuarioYPublicaciones(user.id);
      } else {
        alert("Error al editar publicación");
      }
    } catch (error) {
      console.error("Error al editar:", error);
      alert("Error de conexión al editar");
    }
  };

  // ===============================
  // Archivos (preview)
  // ===============================
  const handleImagenSeleccionada = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // validaciones básicas
    if (!file.type.startsWith("image/")) {
      alert("Por favor, selecciona un archivo de imagen válido");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert("La imagen es demasiado grande. Máximo 10MB permitido.");
      return;
    }

    // si carga imagen, limpiamos video
    setImagenFile(file);
    setVideoFile(null);
    setVideoPreview(null);

    const reader = new FileReader();
    reader.onloadend = () => setImagenPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleVideoSeleccionado = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      alert("Por favor, selecciona un archivo de video válido");
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      alert("El video es demasiado grande. Máximo 50MB permitido.");
      return;
    }

    // si carga video, limpiamos imagen
    setVideoFile(file);
    setImagenFile(null);
    setImagenPreview(null);

    const reader = new FileReader();
    reader.onloadend = () => setVideoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removerImagen = () => {
    setImagenFile(null);
    setImagenPreview(null);
  };

  const removerVideo = () => {
    setVideoFile(null);
    setVideoPreview(null);
  };

  // ===============================
  // Render (sin usuario)
  // ===============================
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 font-semibold">
        No hay usuario logueado ❌
      </div>
    );
  }

  return (
    /**
     * ✅ Importante:
     * - No background-image aquí
     * - Fondo global viene por CSS según el tema
     */
    <div className="min-h-screen flex flex-col relative">
      {/* ✅ Overlay decorativo (glow) sin reemplazar fondo global */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div
          className={[
            "absolute inset-0",
            "bg-[radial-gradient(1200px_600px_at_10%_10%,rgba(236,182,14,0.18),transparent_55%)]",
            "bg-[radial-gradient(900px_450px_at_90%_20%,rgba(59,130,246,0.12),transparent_55%)]",
          ].join(" ")}
        />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <MainHeader showSearch={true} showBack={false} />

        <div className="flex flex-1">
          {/* Sidebar */}
          <aside className="hidden md:block w-64">
            <SidebarMenu />
          </aside>

          {/* Main */}
          <main className="flex-1 px-4 md:px-8 py-6">
            {/* ===== Banner ===== */}
            <section className="relative overflow-hidden rounded-3xl border border-border bg-surface/70 backdrop-blur-xl shadow-pro">
              <div className="relative h-56 md:h-64">
                {profileBanner ? (
                  <img src={profileBanner} alt="Banner" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-bg/40 flex items-center justify-center text-muted">
                    Sin imagen de portada
                  </div>
                )}

                {/* overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-black/10" />

                {/* botón camera (banner) */}
                <label className="absolute top-4 right-4 cursor-pointer">
                  <input type="file" accept="image/*" className="hidden" onChange={handleBannerUpload} />
                  <div className="h-11 w-11 rounded-2xl border border-border bg-surface/50 hover:bg-surface/70 transition flex items-center justify-center shadow-pro">
                    <Camera className="w-5 h-5 text-text" />
                  </div>
                </label>
              </div>

              {/* ===== Perfil card ===== */}
              <div className="relative px-5 md:px-7 pb-6">
                <div className="-mt-14 md:-mt-16 flex flex-col md:flex-row md:items-end gap-4">
                  <div className="relative w-fit">
                    {profilePic ? (
                      <img
                        src={profilePic}
                        alt="avatar"
                        className="w-28 h-28 md:w-32 md:h-32 rounded-3xl border border-border shadow-pro object-cover"
                      />
                    ) : (
                      <div className="w-28 h-28 md:w-32 md:h-32 rounded-3xl border border-border bg-bg/40 flex items-center justify-center shadow-pro">
                        <UserCircle className="w-16 h-16 text-muted" />
                      </div>
                    )}

                    {/* botón camera (avatar) */}
                    <label className="absolute -bottom-2 -right-2 cursor-pointer">
                      <input type="file" accept="image/*" className="hidden" onChange={handleProfilePicUpload} />
                      <div className="h-10 w-10 rounded-2xl bg-accent hover:brightness-95 transition shadow-pro flex items-center justify-center">
                        <Camera className="w-5 h-5 text-slate-900" />
                      </div>
                    </label>
                  </div>

                  <div className="flex-1">
                    <h1 className="text-2xl md:text-3xl font-extrabold text-text drop-shadow">
                      {user.name}
                    </h1>
                    <p className="text-muted mt-1 max-w-3xl">
                      Innovador y apasionado por la tecnología. Con experiencia en desarrollo de soluciones digitales,
                      liderazgo estratégico y transformación digital.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* ===== Acciones flotantes ===== */}
            <div className="mt-6 flex justify-center">
              <div className="rounded-3xl border border-border bg-surface/70 backdrop-blur-xl shadow-pro px-4 py-3 flex items-center gap-3">
                <label className="cursor-pointer" title="Publicar Imagen">
                  <input type="file" accept="image/*" onChange={handleImagenSeleccionada} className="hidden" />
                  <div className="h-11 w-11 rounded-2xl border border-border bg-surface/50 hover:bg-surface/70 transition flex items-center justify-center">
                    <ImageIcon className="w-5 h-5 text-text" />
                  </div>
                </label>

                <label className="cursor-pointer" title="Publicar Video">
                  <input type="file" accept="video/*" onChange={handleVideoSeleccionado} className="hidden" />
                  <div className="h-11 w-11 rounded-2xl border border-border bg-surface/50 hover:bg-surface/70 transition flex items-center justify-center">
                    <Video className="w-5 h-5 text-text" />
                  </div>
                </label>

                <button
                  onClick={publicar}
                  disabled={(!nuevoTexto && !imagenFile && !videoFile) || subiendo}
                  className="h-11 px-5 rounded-2xl bg-accent hover:brightness-95 transition shadow-pro font-semibold text-slate-900 disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2"
                >
                  {subiendo ? (
                    <>
                      <span className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                      Publicando...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Publicar
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* ===== Grid principal ===== */}
            <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
              {/* Columna publicaciones */}
              <section>
                <h2 className="text-xl md:text-2xl font-extrabold text-text mb-4">Mis Publicaciones</h2>

                {/* Crear post */}
                <div className="rounded-3xl border border-border bg-surface/70 backdrop-blur-xl shadow-pro p-5 md:p-6">
                  <textarea
                    value={nuevoTexto}
                    onChange={(e) => setNuevoTexto(e.target.value)}
                    placeholder="¿Qué deseas compartir hoy?"
                    className="w-full rounded-2xl border border-border bg-surface/60 text-text placeholder:text-muted/70 p-4 outline-none focus:ring-2 focus:ring-ring/40 resize-none"
                    rows={4}
                  />

                  {/* Preview imagen */}
                  {imagenPreview && (
                    <div className="relative mt-4 overflow-hidden rounded-2xl border border-border bg-bg/40">
                      <img
                        src={imagenPreview}
                        alt="Previsualización"
                        className="w-full max-h-[420px] object-contain"
                      />
                      <button
                        onClick={removerImagen}
                        className="absolute top-3 right-3 h-10 w-10 rounded-2xl bg-surface/80 hover:bg-surface transition flex items-center justify-center border border-border"
                        title="Quitar imagen"
                      >
                        <X className="w-5 h-5 text-text" />
                      </button>
                    </div>
                  )}

                  {/* Preview video */}
                  {videoPreview && (
                    <div className="relative mt-4 overflow-hidden rounded-2xl border border-border bg-bg/40">
                      <video controls className="w-full max-h-[420px] object-contain">
                        <source src={videoPreview} />
                      </video>
                      <button
                        onClick={removerVideo}
                        className="absolute top-3 right-3 h-10 w-10 rounded-2xl bg-surface/80 hover:bg-surface transition flex items-center justify-center border border-border"
                        title="Quitar video"
                      >
                        <X className="w-5 h-5 text-text" />
                      </button>
                    </div>
                  )}

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-muted">
                      {nuevoTexto ? `Caracteres: ${nuevoTexto.length}` : " "}
                      {(imagenFile || videoFile) ? " • Archivo listo" : ""}
                    </span>

                    <button
                      onClick={publicar}
                      disabled={(!nuevoTexto && !imagenFile && !videoFile) || subiendo}
                      className="h-11 px-5 rounded-2xl bg-surface/70 hover:bg-surface transition text-text font-semibold shadow-pro disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2 border border-border"
                    >
                      {subiendo ? (
                        <>
                          <span className="w-4 h-4 border-2 border-text border-t-transparent rounded-full animate-spin" />
                          Publicando...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Publicar
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Lista posts */}
                <div className="mt-6 space-y-5">
                  {publicaciones.length === 0 ? (
                    <div className="rounded-3xl border border-border bg-surface/70 backdrop-blur-xl shadow-pro p-10 text-center">
                      <div className="text-4xl mb-3">🚀</div>
                      <div className="text-lg font-semibold text-text">Aún no tienes publicaciones</div>
                      <div className="text-sm text-muted mt-1">
                        Comparte tus ideas, imágenes o videos con la comunidad
                      </div>
                    </div>
                  ) : (
                    publicaciones.map((pub) => {
                      const img = normalizePath(pub?.image);
                      const vid = normalizePath(pub?.video);

                      // Fecha segura
                      const createdAt = (() => {
                        const d = new Date(pub?.createdAt);
                        return Number.isNaN(d.getTime()) ? null : d;
                      })();

                      return (
                        <article
                          key={pub.id}
                          className="rounded-3xl border border-border bg-surface/70 backdrop-blur-xl shadow-pro p-5 md:p-6"
                        >
                          <div className="flex items-start justify-between gap-3 mb-4">
                            <div className="flex items-center gap-3">
                              {profilePic ? (
                                <img
                                  src={profilePic}
                                  alt="avatar"
                                  className="w-10 h-10 rounded-2xl object-cover border border-border"
                                  loading="lazy"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-2xl bg-bg/40 border border-border flex items-center justify-center">
                                  <UserCircle className="w-6 h-6 text-muted" />
                                </div>
                              )}

                              <div>
                                <div className="font-semibold text-text">{user.name}</div>
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

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => iniciarEdicion(pub)}
                                className="h-10 w-10 rounded-2xl border border-border bg-surface/50 hover:bg-surface/70 transition flex items-center justify-center"
                                title="Editar"
                              >
                                <Edit className="w-4 h-4 text-text" />
                              </button>
                              <button
                                onClick={() => eliminarPublicacion(pub.id)}
                                className="h-10 w-10 rounded-2xl border border-border bg-surface/50 hover:bg-red-500/10 transition flex items-center justify-center"
                                title="Eliminar"
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </button>
                            </div>
                          </div>

                          {editandoId === pub.id ? (
                            <div className="space-y-3">
                              <textarea
                                value={textoEditado}
                                onChange={(e) => setTextoEditado(e.target.value)}
                                className="w-full rounded-2xl border border-border bg-surface/60 text-text placeholder:text-muted/70 p-4 outline-none focus:ring-2 focus:ring-ring/40 resize-none"
                                rows={3}
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => guardarEdicion(pub.id)}
                                  className="h-11 px-5 rounded-2xl bg-emerald-400 hover:bg-emerald-300 transition text-slate-900 font-semibold shadow-pro inline-flex items-center gap-2"
                                >
                                  <Send className="w-4 h-4" />
                                  Guardar
                                </button>
                                <button
                                  onClick={cancelarEdicion}
                                  className="h-11 px-5 rounded-2xl border border-border bg-surface/50 hover:bg-surface/70 transition text-text font-semibold"
                                >
                                  Cancelar
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              {!!pub.content && (
                                <p className="text-text/90 leading-relaxed text-[15px] mb-4 whitespace-pre-wrap">
                                  {pub.content}
                                </p>
                              )}

                              {img && (
                                <div className="overflow-hidden rounded-2xl border border-border bg-bg/40">
                                  <img
                                    src={`${API_URL}${img}`}
                                    alt="Publicación"
                                    className="w-full max-h-[620px] object-contain"
                                    loading="lazy"
                                  />
                                </div>
                              )}

                              {vid && (
                                <div className="mt-3 overflow-hidden rounded-2xl border border-border bg-bg/40">
                                  <video
                                    controls
                                    src={`${API_URL}${vid}`}
                                    className="w-full max-h-[520px] object-contain"
                                  />
                                </div>
                              )}
                            </>
                          )}
                        </article>
                      );
                    })
                  )}
                </div>
              </section>

              {/* Columna derecha */}
              <aside className="space-y-6">
                <div className="rounded-3xl border border-border bg-surface/70 backdrop-blur-xl shadow-pro p-5">
                  <h3 className="font-extrabold text-text text-lg mb-3">Información</h3>
                  <ul className="text-text/80 space-y-2 text-sm">
                    <li>
                      📩 <b className="text-text">Mensajes:</b> 2
                    </li>
                    <li>
                      📝 <b className="text-text">Publicaciones:</b> {publicaciones.length}
                    </li>
                    <li>
                      👥 <b className="text-text">Amigos:</b> 19
                    </li>
                    <li>
                      🌐 <b className="text-text">Web:</b> www.web.com
                    </li>
                  </ul>
                </div>

                {/* Membresía (asset en public) */}
                <div className="rounded-3xl border border-border bg-accent/20 backdrop-blur-xl shadow-pro p-5">
                  <h3 className="font-extrabold text-slate-900 text-lg mb-4 text-center">
                    Membresía
                  </h3>
                  <div className="flex justify-center">
                    <img src="/Platino.png" alt="Membresía" className="w-40 h-44 object-contain" />
                  </div>
                </div>
              </aside>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}