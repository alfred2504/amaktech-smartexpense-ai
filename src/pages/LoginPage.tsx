import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { API } from "../api/api";
import { FiBarChart2, FiLock, FiShield, FiZap } from "react-icons/fi";
import SiteFooter from "../components/SiteFooter";

export default function LoginPage() {
  const navigate = useNavigate();
  const { setUser, setToken } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await API.post("/auth/login", form);
      const { user, accessToken, refreshToken } = res.data.data;

      localStorage.setItem("token", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));
      setToken(accessToken);
      setUser(user);

      navigate("/dashboard");
    } catch (err: any) {
      const msg = err.response?.data?.message || "Login failed";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-cyan-50 via-white to-amber-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute -left-16 top-10 h-72 w-72 rounded-full bg-cyan-200/45 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-amber-200/45 blur-3xl" />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-white/70 bg-white/75 shadow-2xl shadow-slate-900/10 backdrop-blur lg:flex-row">
        <section className="hidden w-full bg-slate-900 p-8 text-white lg:block lg:w-1/2">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">SmartExpense AI</p>
          <h1 className="mt-4 text-4xl font-black leading-tight">
            Welcome Back To Smarter Money Decisions
          </h1>
          <p className="mt-4 max-w-md text-sm text-slate-300">
            Continue tracking your cash flow, budgets, and AI insights from one secure dashboard.
          </p>

          <div className="mt-8 space-y-3">
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <FiShield className="text-cyan-300" />
              <span className="text-sm text-slate-200">Protected session and secure auth flow</span>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <FiBarChart2 className="text-cyan-300" />
              <span className="text-sm text-slate-200">Instant analytics after login</span>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <FiZap className="text-cyan-300" />
              <span className="text-sm text-slate-200">AI-powered spending suggestions</span>
            </div>
          </div>
        </section>

        <section className="w-full p-6 sm:p-8 lg:w-1/2">
          <div className="mx-auto max-w-md">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">SmartExpense</p>
            <h2 className="mt-2 text-3xl font-black text-slate-900">Log In</h2>
            <p className="mt-2 text-sm text-slate-500">Access your finance workspace in seconds.</p>

            <div className="mt-6 space-y-4">
              <label className="block text-sm font-semibold text-slate-700">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />

              <label className="block text-sm font-semibold text-slate-700">Password</label>
              <div className="relative">
                <FiLock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  placeholder="Enter password"
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>

              <div className="text-right">
                <Link to="/forgot-password" className="text-sm font-semibold text-cyan-700 hover:text-cyan-800">
                  Forgot Password?
                </Link>
              </div>

              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full rounded-xl bg-slate-900 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:opacity-50"
              >
                {loading ? "Logging in..." : "Login to SmartExpense"}
              </button>

              <p className="text-center text-sm text-slate-600">
                Don't have an account?{" "}
                <Link to="/register" className="font-semibold text-cyan-700 hover:text-cyan-800">
                  Register
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>

      <SiteFooter className="relative z-10 mt-8" />
    </div>
  );
}
