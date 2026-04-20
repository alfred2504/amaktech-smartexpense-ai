import { useState } from "react";
import { FiBell, FiLogOut, FiMenu, FiSearch, FiUser } from "react-icons/fi";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { WEB_ICON_URL } from "../constants/brand";

type NavbarProps = {
  toggleSidebar?: () => void;
};

export default function Navbar({ toggleSidebar }: NavbarProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");

  const handleSearch = () => {
    const value = searchText.trim().toLowerCase();
    if (!value) return;

    if (value.includes("dashboard") || value.includes("home")) {
      navigate("/dashboard");
      return;
    }

    if (value.includes("transaction")) {
      navigate("/transactions");
      return;
    }

    if (value.includes("analytic") || value.includes("report") || value.includes("chart")) {
      navigate("/analytics");
      return;
    }

    if (value.includes("budget")) {
      navigate("/budgets");
      return;
    }

    if (value.includes("ai") || value.includes("insight")) {
      navigate("/ai");
      return;
    }

    if (value.includes("profile") || value.includes("account")) {
      navigate("/profile");
      return;
    }

    navigate("/transactions");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/85 px-4 py-3 backdrop-blur dark:border-slate-700 dark:bg-slate-900/85 sm:px-6">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <img
            src={WEB_ICON_URL}
            alt="SmartExpense icon"
            className="h-9 w-9 rounded-xl border border-slate-200 bg-white object-cover shadow-sm dark:border-slate-700"
          />
          <button
            onClick={toggleSidebar}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800 md:hidden"
            aria-label="Open sidebar"
          >
            <FiMenu className="text-lg" />
          </button>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-600 dark:text-cyan-300">
              SmartExpense
            </p>
            <h1 className="text-sm font-black text-slate-900 dark:text-white sm:text-base">AI Finance Hub</h1>
          </div>
        </div>

        <div className="hidden items-center rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-800 md:flex md:w-[38%] lg:w-[42%]">
          <button
            onClick={handleSearch}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            aria-label="Search"
          >
            <FiSearch className="text-base" />
          </button>
          <input
            type="text"
            placeholder="Search transactions, budgets, categories..."
            className="ml-2 w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 dark:text-slate-100"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />

          <button
            onClick={() => navigate("/analytics")}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            aria-label="Notifications"
            title="View insights"
          >
            <FiBell />
          </button>

          <button
            onClick={() => navigate("/profile")}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            aria-label="Profile"
          >
            <FiUser />
          </button>

          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-300 dark:hover:bg-rose-500/20"
          >
            <FiLogOut />
            <span className="hidden lg:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
