import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved || "dark";
  });

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);

    const root = document.documentElement;

    if (theme === "light") {
      // Light mode colors
      root.style.setProperty("--bg-primary", "#f8fafc");
      root.style.setProperty("--bg-secondary", "#e2e8f0");
      root.style.setProperty("--bg-card", "rgba(255, 255, 255, 0.9)");
      root.style.setProperty("--text-primary", "#0f172a");
      root.style.setProperty("--text-secondary", "#475569");
      root.style.setProperty("--border-color", "rgba(0, 0, 0, 0.1)");

      // Glass effect for light mode
      root.style.setProperty("--glass-bg", "rgba(255, 255, 255, 0.7)");
      root.style.setProperty("--glass-border", "rgba(0, 0, 0, 0.1)");
      root.style.setProperty(
        "--glass-shadow",
        "0 8px 32px rgba(0, 0, 0, 0.08)",
      );

      // Gray scale for light mode
      root.style.setProperty("--gray-100", "#1f2937");
      root.style.setProperty("--gray-300", "#374151");
      root.style.setProperty("--gray-400", "#6b7280");
      root.style.setProperty("--gray-500", "#9ca3af");

      // Gradient for light mode
      root.style.setProperty(
        "--gradient-dark",
        "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)",
      );

      // Update body
      document.body.style.background = "var(--gradient-dark)";
      document.body.style.color = "var(--text-primary)";
    } else {
      // Dark mode colors (default)
      root.style.setProperty("--bg-primary", "#0a0a1a");
      root.style.setProperty("--bg-secondary", "#1a1a2e");
      root.style.setProperty("--bg-card", "rgba(255, 255, 255, 0.05)");
      root.style.setProperty("--text-primary", "#ffffff");
      root.style.setProperty("--text-secondary", "#94a3b8");
      root.style.setProperty("--border-color", "rgba(255, 255, 255, 0.1)");

      // Glass effect for dark mode
      root.style.setProperty("--glass-bg", "rgba(255, 255, 255, 0.1)");
      root.style.setProperty("--glass-border", "rgba(255, 255, 255, 0.2)");
      root.style.setProperty("--glass-shadow", "0 8px 32px rgba(0, 0, 0, 0.1)");

      // Gray scale for dark mode
      root.style.setProperty("--gray-100", "#f3f4f6");
      root.style.setProperty("--gray-300", "#d1d5db");
      root.style.setProperty("--gray-400", "#9ca3af");
      root.style.setProperty("--gray-500", "#6b7280");

      // Gradient for dark mode
      root.style.setProperty(
        "--gradient-dark",
        "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
      );

      // Update body
      document.body.style.background = "var(--gradient-dark)";
      document.body.style.color = "var(--text-primary)";
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeContext;
