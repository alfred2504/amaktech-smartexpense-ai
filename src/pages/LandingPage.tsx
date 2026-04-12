import { Link, Navigate } from "react-router-dom";

export default function LandingPage() {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  // 🔥 AUTO REDIRECT IF LOGGED IN
  if (token && user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">

      {/* 🔥 NAVBAR */}
      <div className="flex justify-between items-center p-4 sm:p-6">
        <h1 className="text-xl font-bold">SmartExpense AI</h1>

        <div className="space-x-3">
          <Link
            to="/login"
            className="px-4 py-2 rounded border hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="px-4 py-2 rounded bg-blue-600 text-white"
          >
            Get Started
          </Link>
        </div>
      </div>

      {/* 🔥 HERO */}
      <div className="text-center px-4 mt-16 max-w-3xl mx-auto">
        <h2 className="text-3xl sm:text-5xl font-bold leading-tight">
          Manage Your Money Smarter with AI
        </h2>

        <p className="mt-4 text-gray-600 dark:text-gray-300">
          Track expenses, set budgets, analyze trends, and get AI-powered
          financial insights — all in one place.
        </p>

        <div className="mt-6 flex justify-center gap-4 flex-wrap">
          <Link
            to="/register"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow"
          >
            Start Free
          </Link>

          <Link
            to="/login"
            className="px-6 py-3 border rounded-lg"
          >
            Login
          </Link>
        </div>
      </div>

      {/* 🔥 FEATURES */}
      <div className="mt-20 px-4 sm:px-6 max-w-6xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

        <div className="p-5 rounded-xl shadow bg-gray-50 dark:bg-gray-800">
          <h3 className="font-semibold text-lg">💰 Transactions</h3>
          <p className="text-sm mt-2 text-gray-600 dark:text-gray-300">
            Track income and expenses easily in real-time.
          </p>
        </div>

        <div className="p-5 rounded-xl shadow bg-gray-50 dark:bg-gray-800">
          <h3 className="font-semibold text-lg">📊 Analytics</h3>
          <p className="text-sm mt-2 text-gray-600 dark:text-gray-300">
            Visualize your spending with charts and insights.
          </p>
        </div>

        <div className="p-5 rounded-xl shadow bg-gray-50 dark:bg-gray-800">
          <h3 className="font-semibold text-lg">🎯 Budgets</h3>
          <p className="text-sm mt-2 text-gray-600 dark:text-gray-300">
            Set limits and stay in control of your finances.
          </p>
        </div>

        <div className="p-5 rounded-xl shadow bg-gray-50 dark:bg-gray-800">
          <h3 className="font-semibold text-lg">🤖 AI Insights</h3>
          <p className="text-sm mt-2 text-gray-600 dark:text-gray-300">
            Get smart recommendations powered by AI.
          </p>
        </div>

      </div>

      {/* 🔥 CTA */}
      <div className="mt-20 text-center px-4">
        <h2 className="text-2xl sm:text-3xl font-bold">
          Take Control of Your Finances Today
        </h2>

        <Link
          to="/register"
          className="inline-block mt-6 px-8 py-3 bg-blue-600 text-white rounded-lg shadow"
        >
          Get Started Free
        </Link>
      </div>

      {/* 🔥 FOOTER */}
      <div className="mt-20 text-center p-6 text-sm text-gray-500">
        © {new Date().getFullYear()} SmartExpense AI — Built by AmakTech
      </div>
    </div>
  );
}