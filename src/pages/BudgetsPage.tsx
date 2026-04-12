import { useEffect, useState } from "react";

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);

  const [category, setCategory] = useState("");
  const [limit, setLimit] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 🔥 FETCH BUDGETS
        const resBudgets = await fetch(
          "https://smartexpense-api.onrender.com/api/v1/budgets",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const budgetsData = await resBudgets.json();

        const b =
          budgetsData.data?.budgets ||
          budgetsData.data ||
          budgetsData.budgets ||
          [];

        setBudgets(Array.isArray(b) ? b : []);

        // 🔥 FETCH TRANSACTIONS
        const resTx = await fetch(
          "https://smartexpense-api.onrender.com/api/v1/transactions",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const txData = await resTx.json();

        const t =
          txData.data?.transactions ||
          txData.data ||
          txData.transactions ||
          [];

        setTransactions(Array.isArray(t) ? t : []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!category || !limit) {
      alert("Fill all fields");
      return;
    }

    try {
      const res = await fetch(
        "https://smartexpense-api.onrender.com/api/v1/budgets",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            category,
            limit: Number(limit),
          }),
        }
      );

      const data = await res.json();
      console.log("ADD BUDGET:", data);

      if (!res.ok) {
        throw new Error(data.message || "Failed");
      }

      // 🔥 refresh
      setBudgets((prev) => [data.data || data, ...prev]);

      setCategory("");
      setLimit("");
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (cat: string) => {
    try {
      const res = await fetch(
        `https://smartexpense-api.onrender.com/api/v1/budgets/${cat}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Delete failed");

      setBudgets((prev) =>
        prev.filter((b) => b.category !== cat)
      );
    } catch (err: any) {
      alert(err.message);
    }
  };

  // calculate spending per category
  const getSpent = (cat: string) => {
    return transactions
      .filter((t) => t.type === "expense" && t.category === cat)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Budgets</h1>

      {/* ADD BUDGET */}
      <form
        onSubmit={handleAdd}
        className="bg-white p-4 rounded-lg shadow space-y-3"
      >
        <h2 className="font-bold">Set Budget</h2>

        <input
          type="text"
          placeholder="Category (e.g. Food)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="number"
          placeholder="Limit"
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <button className="w-full bg-blue-600 text-white py-2 rounded">
          Save Budget
        </button>
      </form>

      {/* BUDGET LIST */}
      <div className="space-y-4">
        {budgets.length === 0 ? (
          <p>No budgets yet</p>
        ) : (
          budgets.map((b) => {
            const spent = getSpent(b.category);
            const percent = (spent / b.limit) * 100;

            return (
              <div
                key={b.category}
                className="bg-white p-4 rounded-lg shadow"
              >
                <div className="flex justify-between">
                  <h3 className="font-bold">{b.category}</h3>
                  <button
                    onClick={() => handleDelete(b.category)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </div>

                <p>
                  ${spent} / ${b.limit}
                </p>

                {/* PROGRESS BAR */}
                <div className="w-full bg-gray-200 h-3 rounded mt-2">
                  <div
                    className={`h-3 rounded ${
                      percent > 100
                        ? "bg-red-500"
                        : percent > 70
                        ? "bg-yellow-400"
                        : "bg-green-500"
                    }`}
                    style={{ width: `${Math.min(percent, 100)}%` }}
                  ></div>
                </div>

                {/* ALERT */}
                {percent > 100 && (
                  <p className="text-red-500 mt-2 text-sm">
                    🚨 Budget exceeded!
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}