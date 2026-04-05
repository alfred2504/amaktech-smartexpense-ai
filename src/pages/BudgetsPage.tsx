import { useEffect, useState } from "react";
import { getBudgets, addBudget, deleteBudget } from "../data/budgets";
import { getTransactions } from "../data/transactions";

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);

  const [category, setCategory] = useState("");
  const [limit, setLimit] = useState("");

  useEffect(() => {
    setBudgets(getBudgets());
    setTransactions(getTransactions());
  }, []);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();

    if (!category || !limit) {
      alert("Fill all fields");
      return;
    }

    addBudget({
      category,
      limit: Number(limit),
    });

    setBudgets([...getBudgets()]);
    setCategory("");
    setLimit("");
  };

  const handleDelete = (cat: string) => {
    deleteBudget(cat);
    setBudgets([...getBudgets()]);
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