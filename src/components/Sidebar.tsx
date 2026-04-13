import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaMoneyBill,
  FaChartBar,
  FaWallet,
  FaRobot,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const location = useLocation();

  const { logout } = useAuth();
  const navigate = useNavigate();

  const menu = [
    { name: "Dashboard", path: "/", icon: <FaHome /> },
    { name: "Transactions", path: "/transactions", icon: <FaMoneyBill /> },
    { name: "Analytics", path: "/analytics", icon: <FaChartBar /> },
    { name: "Budgets", path: "/budgets", icon: <FaWallet /> },
    { name: "AI Insights", path: "/ai", icon: <FaRobot /> },
  ];

  return (
    <div className="w-64 h-screen bg-white dark:bg-gray-900 border-r flex flex-col justify-between p-4">
      
      {/* TOP */}
      <div>
        <h1 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
          SmartExpense AI
        </h1>

        <nav className="space-y-2">
          {menu.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 p-2 rounded-md transition ${
                location.pathname === item.path
                  ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200"
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* BOTTOM */}
      <div>
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="flex items-center gap-3 p-2 rounded-md hover:bg-red-100 dark:hover:bg-red-900 text-red-500 w-full text-left"
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
}