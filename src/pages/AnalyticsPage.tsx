import { useMemo, useEffect, useState } from "react";
import { getTransactions } from "../data/transactions";

export default function AnalyticsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    setTransactions(getTransactions());
  }, []);

  const { income, expenses, balance, categories } = useMemo(() => {
    let income = 0;
    let expenses = 0;
    let categories: any = {};

    transactions.forEach((t: any) => {
      if (t.type === "income") {
        income += t.amount;
      } else {
        expenses += t.amount;
        categories[t.category] =
          (categories[t.category] || 0) + t.amount;
      }
    });

    return {
      income,
      expenses,
      balance: income - expenses,
      categories,
    };
  }, [transactions]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Analytics</h1>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-green-100 p-4 rounded-lg">
          <p>Income</p>
          <h2 className="text-xl font-bold">${income}</h2>
        </div>

        <div className="bg-red-100 p-4 rounded-lg">
          <p>Expenses</p>
          <h2 className="text-xl font-bold">${expenses}</h2>
        </div>

        <div className="bg-blue-100 p-4 rounded-lg">
          <p>Balance</p>
          <h2 className="text-xl font-bold">${balance}</h2>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="font-bold mb-3">Spending by Category</h2>

        {Object.keys(categories).length === 0 ? (
          <p>No data yet</p>
        ) : (
          Object.entries(categories).map(([cat, amount]: any) => (
            <div key={cat} className="flex justify-between">
              <span>{cat}</span>
              <span>${amount}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}