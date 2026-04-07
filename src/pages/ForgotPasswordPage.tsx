import { useState } from "react";
import { API } from "../api/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const handleReset = async () => {
    try {
      await API.post("/auth/forgot-password", { email });
      alert("Reset link sent to email");
    } catch (err) {
      alert("Error sending reset email");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow w-full max-w-md space-y-4">

        <h2 className="text-xl font-bold text-center">Forgot Password</h2>

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full p-2 border rounded dark:bg-gray-700"
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={handleReset}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Send Reset Link
        </button>

      </div>
    </div>
  );
}