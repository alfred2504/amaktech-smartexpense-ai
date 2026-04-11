import { useEffect, useState } from "react";

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

  const token = localStorage.getItem("token");

  // 🔥 FETCH TRANSACTIONS
  const fetchTransactions = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "https://smartexpense-api.onrender.com/api/v1/transactions",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      const tx =
        data.data?.transactions ||
        data.data ||
        data.transactions ||
        [];

      setTransactions(Array.isArray(tx) ? tx : []);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 ADD TRANSACTION
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.amount ||
      !form.category ||
      !form.description ||
      !form.date
    ) {
      alert("Fill all fields");
      return;
    }

    try {
      const payload = {
        type: form.type,
        amount: Number(form.amount),
        category: form.category,
        description: form.description,
        date: form.date, // ✅ YYYY-MM-DD
      };

      console.log("SENDING:", payload);

      const res = await fetch(
        "https://smartexpense-api.onrender.com/api/v1/transactions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      console.log("RESPONSE:", data);

      if (!res.ok) {
        throw new Error(data.message || "Validation failed");
      }

      // RESET FORM
      setForm({
        type: "expense",
        amount: "",
        category: "",
        description: "",
        date: "",
      });

      fetchTransactions();

    } catch (err: any) {
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="p-6">

      {/* 🔥 GRID LIKE YOUR DESIGN */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* 🔥 LEFT CARD (FORM) */}
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow space-y-4"
        >
          <h2 className="font-semibold text-lg text-gray-900 dark:text-white">
            Add Transaction
          </h2>

          <select
            value={form.type}
            onChange={(e) =>
              setForm({ ...form, type: e.target.value })
            }
            className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white"
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>

          <input
            type="number"
            placeholder="Amount"
            value={form.amount}
            onChange={(e) =>
              setForm({ ...form, amount: e.target.value })
            }
            className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white"
          />

          <input
            type="text"
            placeholder="Category"
            value={form.category}
            onChange={(e) =>
              setForm({ ...form, category: e.target.value })
            }
            className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white"
          />

          {/* 🔥 NEW DESCRIPTION FIELD */}
          <input
            type="text"
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white"
          />

          {/* 🔥 FIXED DATE */}
          <input
            type="date"
            value={form.date}
            onChange={(e) =>
              setForm({ ...form, date: e.target.value })
            }
            className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white"
          />

          <button className="w-full bg-blue-600 text-white py-2 rounded">
            Add
          </button>
        </form>

        {/* 🔥 RIGHT CARD (LIST) */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow">
          <h2 className="font-semibold text-lg mb-4 text-gray-900 dark:text-white">
            Transactions
          </h2>

          {loading ? (
            <p className="text-gray-600 dark:text-gray-300">
              Loading...
            </p>
          ) : transactions.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300">
              No transactions yet
            </p>
          ) : (
            <div className="space-y-3">
              {transactions.map((t: any) => (
                <div
                  key={t.id || t._id}
                  className="p-3 border rounded flex justify-between dark:border-gray-700"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {t.description}
                    </p>
                    <p className="text-sm text-gray-500">
                      {t.category}
                    </p>
                  </div>

                  <p className="font-semibold text-gray-900 dark:text-white">
                    ${t.amount}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}