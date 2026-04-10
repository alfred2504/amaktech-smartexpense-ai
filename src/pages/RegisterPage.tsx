import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleRegister = async () => {
    try {
      console.log("Sending request...", form);

      const res = await fetch(
        "https://smartexpense-api.onrender.com/api/v1/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      console.log("RESPONSE:", data); // 👈 CHECK THIS IN CONSOLE

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      alert("Registration successful");

      // Redirect to login after success
      navigate("/login");

    } catch (err: any) {
      console.error("ERROR:", err);
      alert(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow w-full max-w-md space-y-4">

        <h2 className="text-xl font-bold text-center text-gray-900 dark:text-white">
          Register
        </h2>

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
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Register
        </button>

        <p className="text-center text-sm text-gray-700 dark:text-gray-300">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}