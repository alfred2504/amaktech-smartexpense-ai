import { FaBell, FaSearch, FaUserCircle } from "react-icons/fa";
import ThemeToggle from "./ThemeToggle";
import { useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const getTitle = () => {
    if (location.pathname === "/") return "Dashboard";
    if (location.pathname.includes("transactions")) return "Transactions";
    if (location.pathname.includes("analytics")) return "Analytics";
    if (location.pathname.includes("budgets")) return "Budgets";
    if (location.pathname.includes("ai")) return "AI Insights";
    if (location.pathname.includes("profile")) return "Profile";
    return "Dashboard";
  };

  return (
    <div className="w-full bg-white dark:bg-gray-900 border-b px-4 py-3 flex items-center justify-between">

      {/* LEFT */}
      <h1 className="text-xl font-semibold">{getTitle()}</h1>

      {/* RIGHT */}
      <div className="flex items-center gap-4">

        {/* SEARCH */}
        <div className="hidden md:flex items-center bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-md">
          <FaSearch className="mr-2" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none text-sm"
          />
        </div>

        {/* NOTIFICATIONS */}
        <FaBell className="text-lg cursor-pointer" />

        {/* THEME (GLOBAL) */}
        <ThemeToggle />

        {/* PROFILE CLICK */}
        <div
          onClick={() => navigate("/profile")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <FaUserCircle className="text-2xl" />
          <span className="hidden md:block text-sm">Profile</span>
        </div>

      </div>
    </div>
  );
}