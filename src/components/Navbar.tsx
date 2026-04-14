import { FaBars, FaSearch, FaBell, FaUserCircle } from "react-icons/fa";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Navbar({ toggleSidebar }: any) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 border-b">

      {/* 🔥 LEFT */}
      <div className="flex items-center gap-3">
        
        {/* HAMBURGER */}
        <button
          onClick={toggleSidebar}
          className="md:hidden text-xl text-gray-800 dark:text-white"
        >
          <FaBars />
        </button>

        <h1 className="font-bold text-gray-900 dark:text-white">
          SmartExpense AI
        </h1>
      </div>

      {/* 🔥 CENTER (SEARCH) */}
      <div className="hidden md:flex items-center bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-lg w-1/3">
        <FaSearch className="text-gray-500" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent outline-none ml-2 w-full text-gray-800 dark:text-white"
        />
      </div>

      {/* 🔥 RIGHT */}
      <div className="flex items-center gap-4">

        {/* THEME */}
        <ThemeToggle />

        {/* NOTIFICATIONS */}
        <FaBell className="text-gray-700 dark:text-gray-300 cursor-pointer" />

        {/* PROFILE */}
        <FaUserCircle
          className="text-2xl text-gray-700 dark:text-gray-300 cursor-pointer"
          onClick={() => navigate("/profile")}
        />

        {/* LOGOUT */}
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="block text-sm text-red-500 hover:underline"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
