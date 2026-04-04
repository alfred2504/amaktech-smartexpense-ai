import { FaBell } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { logout, user } = useAuth();

  return (
    <div className="flex justify-between items-center p-4 bg-white border-b">
      {/* Mobile Menu */}
      <button className="md:hidden text-xl">☰</button>

      {/* Search */}
      <input
        type="text"
        placeholder="Search..."
        className="hidden md:block px-4 py-2 border rounded-md w-1/3"
      />

      {/* Right */}
      <div className="flex items-center gap-4">
        <FaBell />

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          <span className="hidden sm:block">{user?.email}</span>
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}