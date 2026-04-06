import { useEffect, useState } from "react";
import { getTransactions } from "../data/transactions";

export default function AIPage() {
  const [insight, setInsight] = useState("");

  useEffect(() => {
    const transactions = getTransactions();

    const totalExpenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    if (totalExpenses > 1000) {
      setInsight("⚠️ Your spending is high. Consider reducing expenses.");
    } else if (totalExpenses > 500) {
      setInsight("👍 You are doing okay, but monitor your spending.");
    } else {
      setInsight("✅ Great job! Your spending is under control.");
    }
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">AI Insights</h1>

      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-lg">{insight}</p>
      </div>
    </div>
  );
}