import { NavLink, useNavigate } from "react-router-dom";
import {
  FiBarChart2,
  FiCreditCard,
  FiCpu,
  FiHome,
  FiLogOut,
  FiTarget,
  FiX,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

type SidebarProps = {
  onNavigate?: () => void;
  onClose?: () => void;
  showCloseButton?: boolean;
};

export default function Sidebar({ onNavigate, onClose, showCloseButton = false }: SidebarProps) {

  const { logout } = useAuth();
  const navigate = useNavigate();

  const menu = [
    { name: "Dashboard", path: "/dashboard", icon: <FiHome /> },
    { name: "Transactions", path: "/transactions", icon: <FiCreditCard /> },
    { name: "Analytics", path: "/analytics", icon: <FiBarChart2 /> },
    { name: "Budgets", path: "/budgets", icon: <FiTarget /> },
    { name: "AI Insights", path: "/ai", icon: <FiCpu /> },
  ];

  return (
    <aside className="flex h-full w-72 flex-col justify-between border-r border-slate-200/70 bg-white px-4 py-5 dark:border-slate-700 dark:bg-slate-900">
      <div>
        <div className="mb-6 flex items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 dark:border-slate-700 dark:bg-slate-800">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-600 dark:text-cyan-300">
              SmartExpense
            </p>
            <h2 className="text-sm font-black text-slate-900 dark:text-white">Control Center</h2>
          </div>
          {showCloseButton && (
            <button
              onClick={onClose}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700"
              aria-label="Close sidebar"
            >
              <FiX />
            </button>
          )}
        </div>

        <nav className="space-y-1.5">
          {menu.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                  isActive
                    ? "bg-cyan-50 text-cyan-700 ring-1 ring-cyan-200 dark:bg-cyan-500/15 dark:text-cyan-200 dark:ring-cyan-400/30"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                }`
              }
            >
              <span className="text-base">{item.icon}</span>
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-2 dark:border-rose-400/20 dark:bg-rose-500/10">
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold text-rose-600 transition hover:bg-rose-100 dark:text-rose-300 dark:hover:bg-rose-500/20"
        >
          <FiLogOut />
          Logout
        </button>
      </div>
    </aside>
  );
}