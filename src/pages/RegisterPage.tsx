import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { API } from "../api/api";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { setUser, setToken } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    try {
      const res = await API.post("/auth/register", form);
      const { user, accessToken, refreshToken } = res.data.data;

      localStorage.setItem("token", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));
      setToken(accessToken);
      setUser(user);

      navigate("/");
    } catch (err: any) {
      const msg = err.response?.data?.message || "Registration failed";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow w-full max-w-md space-y-4">
        <h2 className="text-xl font-bold text-center text-gray-900 dark:text-white">Register</h2>

        <input
          placeholder="Name"
          className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
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

        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="text-center text-sm text-gray-700 dark:text-gray-300">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500">Login</Link>
        </p>
      </div>
    </div>
  );
}
