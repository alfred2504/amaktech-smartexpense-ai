import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { API } from "../api/api";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        await API.post("/auth/logout", { refreshToken });
      }
    } catch {
      // proceed with local logout even if API call fails
    } finally {
      logout();
      navigate("/login");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Profile</h1>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow space-y-4">
        <div>
          <p className="text-sm text-gray-500">Name</p>
          <p className="font-semibold text-gray-900 dark:text-white">{user?.name || "—"}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Email</p>
          <p className="font-semibold text-gray-900 dark:text-white">{user?.email || "—"}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Member since</p>
          <p className="font-semibold text-gray-900 dark:text-white">{user?.createdAt || "—"}</p>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
