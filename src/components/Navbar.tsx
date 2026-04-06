import { FaBell, FaSearch, FaUserCircle } from "react-icons/fa";
import ThemeToggle from "./ThemeToggle";
import { useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  // Dynamic title
  const getTitle = () => {
    if (location.pathname === "/") return "Dashboard";
    if (location.pathname.includes("transactions")) return "Transactions";
    if (location.pathname.includes("analytics")) return "Analytics";
    if (location.pathname.includes("budgets")) return "Budgets";
    if (location.pathname.includes("ai")) return "AI Insights";
    return "Dashboard";
  };

  return (
    <div className="w-full bg-white dark:bg-gray-900 border-b px-4 py-3 flex items-center justify-between">
      
      {/* LEFT - PAGE TITLE */}
      <h1 className="text-xl font-semibold">
        {getTitle()}
      </h1>

      {/* RIGHT */}
      <div className="flex items-center gap-4">

        {/* SEARCH */}
        <div className="hidden md:flex items-center bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-md">
          <FaSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none text-sm"
          />
        </div>

        {/* NOTIFICATIONS */}
        <button className="relative">
          <FaBell className="text-lg" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
            2
          </span>
        </button>

        {/* THEME TOGGLE */}
        <ThemeToggle />

        {/* USER */}
        <div className="flex items-center gap-2 cursor-pointer">
          <FaUserCircle className="text-2xl" />
          <span className="hidden md:block text-sm">User</span>
        </div>

      </div>
    </div>
  );
}