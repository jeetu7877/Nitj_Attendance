// src/context/ThemeContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("nitj_dark");
    return saved ? JSON.parse(saved) : false;
  });

  const [fontSize, setFontSize] = useState(
    () => localStorage.getItem("nitj_font") || "md"
  );

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
    localStorage.setItem("nitj_dark", JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    const map = { sm: "sm", md: null, lg: "lg" };
    document.documentElement.setAttribute("data-font", map[fontSize] || "");
    localStorage.setItem("nitj_font", fontSize);
  }, [fontSize]);

  const toggleDark = () => setDarkMode((d) => !d);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDark, fontSize, setFontSize }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
