import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaMoneyBill,
  FaChartBar,
  FaWallet,
  FaRobot,
  FaUser,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const location = useLocation();

  // 🔥 ADDED (for logout only)
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
    <div className="w-64 h-screen bg-white border-r flex flex-col justify-between p-4">
      
      {/* TOP */}
      <div>
        <h1 className="text-xl font-bold mb-6">SmartExpense AI</h1>

        <nav className="space-y-2">
          {menu.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 p-2 rounded-md transition ${
                location.pathname === item.path
                  ? "bg-blue-100 text-blue-600"
                  : "hover:bg-gray-100"
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* BOTTOM */}
      <div className="space-y-2">
        <Link
          to="/profile"
          className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100"
        >
          <FaUser />
          Profile
        </Link>

        {/* 🔥 FIXED LOGOUT BUTTON */}
        <button
          onClick={() => {
            logout(); // clears token + user
            navigate("/login"); // redirect
          }}
          className="flex items-center gap-3 p-2 rounded-md hover:bg-red-100 text-red-500 w-full text-left"
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
}