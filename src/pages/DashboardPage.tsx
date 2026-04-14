import { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import PieChartBox from "../components/PieChartBox";
import LineChartBox from "../components/LineChartBox";
import { API } from "../api/api";

export default function DashboardPage() {
  const [summary, setSummary] = useState({ balance: 0, income: 0, expenses: 0 });
  const [pieData, setPieData] = useState<any[]>([]);
  const [lineData, setLineData] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        // Summary cards — response: data.summary
        const resSummary = await API.get("/transactions/summary");
        const s = resSummary.data.data.summary;
        setSummary({
          balance: s.balance ?? 0,
          income: s.totalIncome ?? 0,
          expenses: s.totalExpense ?? 0,
        });

        // Breakdown pie chart — response: data.breakdown (array)
        const resBreakdown = await API.get("/transactions/breakdown");
        const breakdown: any[] = resBreakdown.data.data.breakdown ?? [];
        setPieData(breakdown.map((b) => ({ name: b.category, value: b.total })));

        // Trend line chart — response: data.trend (array)
        const resTrend = await API.get("/transactions/trend");
        const trend: any[] = resTrend.data.data.trend ?? [];
        setLineData(trend);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Total Balance" value={summary.balance} gradient="bg-gradient-to-r from-[#3B82F6] to-[#2563EB]" />
        <StatCard title="Income" value={summary.income} gradient="bg-gradient-to-r from-[#22C55E] to-[#16A34A]" />
        <StatCard title="Expenses" value={summary.expenses} gradient="bg-gradient-to-r from-[#EF4444] to-[#DC2626]" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PieChartBox data={pieData} />
        <LineChartBox data={lineData} />
      </div>
    </div>
  );
}
