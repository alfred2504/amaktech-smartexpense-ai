import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const handleReset = async () => {
    try {
      console.log("Sending reset email...");

      const res = await fetch(
        "https://smartexpense-api.onrender.com/api/v1/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();
      console.log("RESET RESPONSE:", data);

      if (!res.ok) {
        throw new Error(data.message || "Failed to send reset link");
      }

      alert("Reset link sent to your email");

    } catch (err: any) {
      console.error("RESET ERROR:", err);
      alert(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow w-full max-w-md space-y-4">

        <h2 className="text-xl font-bold text-center text-gray-900 dark:text-white">
          Forgot Password
        </h2>

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
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