import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { API } from "../api/api";

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

      navigate("/");
    } catch (err: any) {
      const msg = err.response?.data?.message || "Login failed";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow w-full max-w-md space-y-4">
        <h2 className="text-xl font-bold text-center text-gray-900 dark:text-white">Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <div className="text-right">
          <Link to="/forgot-password" className="text-blue-500 text-sm">Forgot Password?</Link>
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-sm text-gray-700 dark:text-gray-300">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-500">Register</Link>
        </p>
      </div>
    </div>
  );
}
