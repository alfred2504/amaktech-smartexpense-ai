import { useEffect, useState } from "react";
import { API } from "../api/api";

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<any[]>([]);
  const [form, setForm] = useState({
    category: "",
    limit: "",
    period: "MONTHLY",
    startDate: "",
    endDate: "",
  });

  const fetchBudgets = async () => {
    try {
      const res = await API.get("/budgets");
      setBudgets(res.data.data.budgets ?? []);
    } catch (err) {
      console.error("Fetch budgets error:", err);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.category || !form.limit || !form.startDate || !form.endDate) {
      alert("Fill all fields");
      return;
    }
    try {
      await API.post("/budgets", {
        category: form.category,
        limit: Number(form.limit),
        period: form.period,
        startDate: new Date(form.startDate).toISOString(),
        endDate: new Date(form.endDate).toISOString(),
      });
      setForm({ category: "", limit: "", period: "MONTHLY", startDate: "", endDate: "" });
      fetchBudgets();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to create budget");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await API.delete(`/budgets/${id}`);
      fetchBudgets();
    } catch (err: any) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  const statusColor = (status: string) => {
    if (status === "exceeded") return "bg-red-500";
    if (status === "critical") return "bg-orange-500";
    if (status === "warning") return "bg-yellow-400";
    return "bg-green-500";
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Budgets</h1>

      {/* Form */}
      <form
        onSubmit={handleAdd}
        className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow space-y-3"
      >
        <h2 className="font-bold text-gray-900 dark:text-white">Set Budget</h2>

        <input
          type="text"
          placeholder="Category (e.g. Food)"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white"
        />

        <input
          type="number"
          placeholder="Limit"
          value={form.limit}
          onChange={(e) => setForm({ ...form, limit: e.target.value })}
          className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white"
        />

        <select
          value={form.period}
          onChange={(e) => setForm({ ...form, period: e.target.value })}
          className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white"
        >
          <option value="WEEKLY">Weekly</option>
          <option value="MONTHLY">Monthly</option>
          <option value="YEARLY">Yearly</option>
        </select>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-gray-500 dark:text-gray-400">Start Date</label>
            <input
              type="date"
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="text-sm text-gray-500 dark:text-gray-400">End Date</label>
            <input
              type="date"
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        <button className="w-full bg-blue-600 text-white py-2 rounded">Save Budget</button>
      </form>

      {/* Budget List */}
      <div className="space-y-4">
        {budgets.length === 0 ? (
          <p className="text-gray-500">No budgets yet</p>
        ) : (
          budgets.map((b) => (
            <div key={b.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-bold text-gray-900 dark:text-white">{b.category}</h3>
                <button onClick={() => handleDelete(b.id)} className="text-red-500 text-sm">Delete</button>
              </div>

              <p className="text-sm text-gray-500 mb-2">
                ${b.spent} / ${b.limit} · {b.daysLeft} days left · {b.period}
              </p>

              <div className="w-full bg-gray-200 dark:bg-gray-700 h-3 rounded">
                <div
                  className={`h-3 rounded ${statusColor(b.status)}`}
                  style={{ width: `${Math.min(b.percentageUsed, 100)}%` }}
                />
              </div>

              {b.isExceeded && (
                <p className="text-red-500 mt-2 text-sm">🚨 Budget exceeded!</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
