import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaExchangeAlt,
  FaChartPie,
  FaWallet,
  FaUser,
} from "react-icons/fa";

const menu = [
  { name: "Dashboard", path: "/", icon: <FaHome /> },
  { name: "Transactions", path: "/transactions", icon: <FaExchangeAlt /> },
  { name: "Analytics", path: "/analytics", icon: <FaChartPie /> },
  { name: "Budgets", path: "/budgets", icon: <FaWallet /> },
  { name: "Profile", path: "/profile", icon: <FaUser /> },
];

export default function Sidebar() {
  return (
    <div className="hidden md:flex w-64 h-screen bg-white p-4 flex-col border-r">
      <h1 className="text-xl font-bold mb-8">SmartExpense AI</h1>

      <nav className="flex flex-col gap-2">
        {menu.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100"
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}