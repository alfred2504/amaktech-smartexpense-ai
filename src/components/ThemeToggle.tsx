import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { dark, setDark } = useTheme();

  return (
    <button
      onClick={() => setDark(!dark)}
      className="p-2 rounded bg-gray-200 dark:bg-gray-700"
    >
      {dark ? "☀️ Light" : "🌙 Dark"}
    </button>
  );
}