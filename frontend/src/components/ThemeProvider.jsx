import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

/**
 * Contexto global del tema.
 * Guarda el estado del tema y expone setTheme para cambiarlo desde la UI.
 */
const ThemeContext = createContext(null);

/**
 * Clave de LocalStorage donde se persiste el tema seleccionado por el usuario.
 * Valores esperados: "dark" | "light"
 */
const KEY = "ecosysval_theme";

/**
 * ThemeProvider
 * - Inicializa el tema (dark-first).
 * - Lee el tema guardado en localStorage al montar.
 * - Escribe data-theme en <html> para que CSS cambie variables globales.
 * - Persiste el tema en localStorage.
 */
export function ThemeProvider({ children }) {
  // Dark-first: la app inicia en oscuro, pero puede ser reemplazado por lo guardado.
  const [theme, setTheme] = useState("dark");

  /**
   * Al montar:
   * - Revisa si el usuario ya tenía un tema guardado.
   * - Si existe y es válido, actualiza el estado.
   */
  useEffect(() => {
    const saved = localStorage.getItem(KEY);
    if (saved === "dark" || saved === "light") setTheme(saved);
  }, []);

  /**
   * Cada vez que cambie el tema:
   * - Aplica el atributo data-theme al <html>.
   * - Persiste la preferencia en localStorage.
   *
   * Esto habilita estilos tipo:
   * html[data-theme="dark"] { ...variables... }
   */
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(KEY, theme);
  }, [theme]);

  /**
   * Memoiza el valor del contexto para evitar renders innecesarios.
   */
  const value = useMemo(() => ({ theme, setTheme }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/**
 * Hook de consumo del tema.
 * Lanza error si se usa por fuera del ThemeProvider (evita nulls silenciosos).
 */
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme debe usarse dentro de ThemeProvider");
  return ctx;
}