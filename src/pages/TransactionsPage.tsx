import { useEffect, useState } from "react";
import { API } from "../api/api";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    type: "expense",
    amount: "",
    category: "",
    description: "",
    date: "",
  });

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await API.get("/transactions");
      setTransactions(res.data.data.items ?? []);
    } catch (err) {
      console.error("Fetch transactions error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.amount || !form.category || !form.date) {
      alert("Fill all required fields");
      return;
    }
    try {
      await API.post("/transactions", {
        type: form.type,
        amount: Number(form.amount),
        category: form.category,
        description: form.description,
        date: form.date,
      });
      setForm({ type: "expense", amount: "", category: "", description: "", date: "" });
      fetchTransactions();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to add transaction");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await API.delete(`/transactions/${id}`);
      fetchTransactions();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete");
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="p-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow space-y-4"
        >
          <h2 className="font-semibold text-lg text-gray-900 dark:text-white">Add Transaction</h2>

          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white"
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>

          <input
            type="number"
            placeholder="Amount"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white"
          />

          <input
            type="text"
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white"
          />

          <input
            type="text"
            placeholder="Description (optional)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white"
          />

          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white"
          />

          <button className="w-full bg-blue-600 text-white py-2 rounded">Add</button>
        </form>

        {/* List */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow">
          <h2 className="font-semibold text-lg mb-4 text-gray-900 dark:text-white">Transactions</h2>

          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : transactions.length === 0 ? (
            <p className="text-gray-500">No transactions yet</p>
          ) : (
            <div className="space-y-3">
              {transactions.map((t: any) => (
                <div
                  key={t.id}
                  className="p-3 border rounded flex justify-between items-center dark:border-gray-700"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{t.description || t.category}</p>
                    <p className="text-sm text-gray-500">{t.category} · {t.date}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className={`font-semibold ${t.type === "INCOME" ? "text-green-600" : "text-red-500"}`}>
                      {t.type === "INCOME" ? "+" : "-"}${t.amount}
                    </p>
                    <button onClick={() => handleDelete(t.id)} className="text-red-400 text-sm">✕</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
