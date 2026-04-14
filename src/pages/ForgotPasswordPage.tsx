import { useState } from "react";
import { Link } from "react-router-dom";
import { API } from "../api/api";

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
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow w-full max-w-md space-y-4">
        <h2 className="text-xl font-bold text-center text-gray-900 dark:text-white">Forgot Password</h2>

        {sent ? (
          <div className="text-center space-y-3">
            <p className="text-green-600">If an account with that email exists, a reset link has been sent.</p>
            <Link to="/login" className="text-blue-500 text-sm">Back to Login</Link>
          </div>
        ) : (
          <>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            />
            <button
              onClick={handleReset}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
            <p className="text-center text-sm">
              <Link to="/login" className="text-blue-500">Back to Login</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
