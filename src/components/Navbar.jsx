export default function Navbar() {
  return (
    <div className="bg-white shadow-md p-4 flex justify-between items-center">
      <h2 className="text-lg font-semibold">Dashboard</h2>
      <div className="flex items-center gap-4">
        <span className="text-gray-600">Welcome, User</span>
        <div className="w-8 h-8 bg-blue-600 text-white flex items-center justify-center rounded-full">
          
        </div>
      </div>
    </div>
  );
}