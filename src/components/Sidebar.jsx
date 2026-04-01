import { NavLink } from "react-router-dom";
import { FaHome, FaMoneyBill, FaChartBar } from "react-icons/fa";

export default function Sidebar() {
  const baseClasses =
    "flex items-center gap-3 p-3 rounded-lg hover:bg-gray-200 transition-colors";
  const activeClasses = "bg-blue-600 text-white";

  return (
    <div className="w-64 bg-white shadow-md p-4 flex flex-col">
      <h1 className="text-xl font-bold mb-6 text-blue-600">AmakTech AI</h1>
      <nav className="flex flex-col gap-2">
        <NavLink
          to="/"
          className={({ isActive }) => `${baseClasses} ${isActive ? activeClasses : ""}`}
        >
          <FaHome /> Dashboard
        </NavLink>
        <NavLink
          to="/expenses"
          className={({ isActive }) => `${baseClasses} ${isActive ? activeClasses : ""}`}
        >
          <FaMoneyBill /> Expenses
        </NavLink>
        <NavLink
          to="/reports"
          className={({ isActive }) => `${baseClasses} ${isActive ? activeClasses : ""}`}
        >
          <FaChartBar /> Reports
        </NavLink>
      </nav>
    </div>
  );
}