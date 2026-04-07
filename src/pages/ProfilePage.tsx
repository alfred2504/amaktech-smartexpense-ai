import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
  const { user, setUser } = useAuth();

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Profile</h1>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow space-y-4">
        
        {/* USER INFO */}
        <div>
          <p className="text-sm text-gray-500">Name</p>
          <p className="font-semibold">{user?.name || "User Name"}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Email</p>
          <p className="font-semibold">{user?.email || "user@email.com"}</p>
        </div>

        {/* ACTIONS */}
        <div className="flex gap-4 pt-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Edit Profile
          </button>

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