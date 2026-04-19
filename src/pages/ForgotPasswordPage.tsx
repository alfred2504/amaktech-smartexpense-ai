import { useState } from "react";
import { Link } from "react-router-dom";
import { API } from "../api/api";
import { FiMail, FiShield } from "react-icons/fi";
import SiteFooter from "../components/SiteFooter";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email) return;
    setLoading(true);
    try {
      await API.post("/auth/forgot-password", { email });
      setSent(true);
    } catch (err: any) {
      // API always returns 200 regardless — show success anyway
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-cyan-50 via-white to-sky-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute -left-16 top-24 h-80 w-80 rounded-full bg-cyan-200/45 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-sky-200/45 blur-3xl" />

      <div className="relative mx-auto w-full max-w-xl rounded-3xl border border-white/70 bg-white/80 p-6 shadow-2xl shadow-slate-900/10 backdrop-blur sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">SmartExpense AI</p>
        <h2 className="mt-2 text-3xl font-black text-slate-900">Reset Your Password</h2>
        <p className="mt-2 text-sm text-slate-500">
          Enter your account email and we will send instructions to regain access.
        </p>

        {sent ? (
          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-center">
            <p className="text-sm font-semibold text-emerald-700">
              If an account with that email exists, a reset link has been sent.
            </p>
            <Link to="/login" className="mt-3 inline-block text-sm font-bold text-cyan-700 hover:text-cyan-800">
              Back to Login
            </Link>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            <label className="block text-sm font-semibold text-slate-700">Email</label>
            <div className="relative">
              <FiMail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
              />
            </div>

            <button
              onClick={handleReset}
              disabled={loading}
              className="w-full rounded-xl bg-slate-900 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

            <p className="flex items-center justify-center gap-2 text-xs text-slate-500">
              <FiShield />
              For security, we do not reveal whether an email is registered.
            </p>

            <p className="text-center text-sm">
              <Link to="/login" className="font-semibold text-cyan-700 hover:text-cyan-800">
                Back to Login
              </Link>
            </p>
          </div>
        )}
      </div>

      <SiteFooter className="relative z-10 mt-8" />
    </div>
  );
}
