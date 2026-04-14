import { useEffect, useState } from "react";
import { API } from "../api/api";

export default function AnalyticsPage() {
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });
  const [breakdown, setBreakdown] = useState<any[]>([]);
  const [trend, setTrend] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resSummary, resBreakdown, resTrend] = await Promise.all([
          API.get("/transactions/summary"),
          API.get("/transactions/breakdown"),
          API.get("/transactions/trend"),
        ]);

        setSummary(resSummary.data.data.summary);
        setBreakdown(resBreakdown.data.data.breakdown ?? []);
        setTrend(resTrend.data.data.trend ?? []);
      } catch (err) {
        console.error("Analytics fetch error:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Analytics</h1>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-green-100 dark:bg-green-900 p-4 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-300">Income</p>
          <h2 className="text-xl font-bold">${summary.totalIncome}</h2>
        </div>
        <div className="bg-red-100 dark:bg-red-900 p-4 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-300">Expenses</p>
          <h2 className="text-xl font-bold">${summary.totalExpense}</h2>
        </div>
        <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-300">Balance</p>
          <h2 className="text-xl font-bold">${summary.balance}</h2>
        </div>
      </div>

      {/* Spending Breakdown */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h2 className="font-bold mb-3 text-gray-900 dark:text-white">Spending by Category</h2>
        {breakdown.length === 0 ? (
          <p className="text-gray-500">No data yet</p>
        ) : (
          <div className="space-y-2">
            {breakdown.map((b) => (
              <div key={b.category} className="flex justify-between items-center">
                <span className="capitalize text-gray-700 dark:text-gray-300">{b.category}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">{b.percentage}%</span>
                  <span className="font-semibold text-gray-900 dark:text-white">${b.total}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Monthly Trend */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h2 className="font-bold mb-3 text-gray-900 dark:text-white">Monthly Trend</h2>
        {trend.length === 0 ? (
          <p className="text-gray-500">No trend data yet</p>
        ) : (
          <div className="space-y-2">
            {trend.map((t) => (
              <div key={t.month} className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">{t.month}</span>
                <span className="text-green-600">+${t.income}</span>
                <span className="text-red-500">-${t.expense}</span>
                <span className="font-semibold text-gray-900 dark:text-white">Net: ${t.net}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
