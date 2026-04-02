import { FaBell } from "react-icons/fa";

export default function Navbar() {
  return (
    <div className="flex justify-between items-center p-4 bg-white">
      
      {/* Search */}
      <input
        type="text"
        placeholder="Search..."
        className="px-4 py-2 border rounded-md w-1/3"
      />

      {/* Right side */}
      <div className="flex items-center gap-4">
        <FaBell />

        {/* Dynamic User Placeholder */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-300"></div>
          <span>User</span>
        </div>
      </div>
    </div>
  );
}