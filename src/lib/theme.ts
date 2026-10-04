import { useEffect, useState } from "react";

export type Theme = "dark" | "light";
const KEY = "belpay.theme";

/** Inline script run before paint to avoid a theme flash. */
export const themeInitScript = `try{if(localStorage.getItem("${KEY}")==="light")document.documentElement.classList.remove("dark")}catch(e){}`;

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("dark");
  useEffect(() => {
    setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
  }, []);
  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.classList.toggle("dark", next === "dark");
    localStorage.setItem(KEY, next);
    setTheme(next);
  };
  return { theme, toggle };
}
