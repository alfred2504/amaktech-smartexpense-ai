import { FaBell } from "react-icons/fa";

export default function Navbar() {
  return (
    <div className="flex justify-between items-center p-4 bg-white border-b">
      {/* Mobile Menu Button (future sidebar toggle) */}
      <button className="md:hidden text-xl">☰</button>

      {/* Search */}
      <input
        type="text"
        placeholder="Search..."
        className="hidden md:block px-4 py-2 border rounded-md w-1/3"
      />

      {/* Right Side */}
      <div className="flex items-center gap-4">
        <FaBell />

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          <span className="hidden sm:block">User</span>
        </div>
      </div>
    </div>
  );
}