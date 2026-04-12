import { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import PieChartBox from "../components/PieChartBox";
import LineChartBox from "../components/LineChartBox";

export default function DashboardPage() {
  const [data, setData] = useState({
    balance: 0,
    income: 0,
    expenses: 0,
  });

  const [pieData, setPieData] = useState<any[]>([]);
  const [lineData, setLineData] = useState<any[]>([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        // 🔥 SUMMARY (cards)
        const resSummary = await fetch(
          "https://smartexpense-api.onrender.com/api/v1/transactions/summary",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const summaryData = await resSummary.json();
        console.log("SUMMARY:", summaryData);

        const summary =
          summaryData.data || summaryData;

        setData({
          balance: summary.balance || 0,
          income: summary.income || 0,
          expenses: summary.expenses || 0,
        });

        // 🔥 BREAKDOWN (pie chart)
        const resBreakdown = await fetch(
          "https://smartexpense-api.onrender.com/api/v1/transactions/breakdown",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const breakdownData = await resBreakdown.json();
        console.log("BREAKDOWN:", breakdownData);

        const breakdown =
          breakdownData.data || breakdownData;

        const formattedPie = Object.entries(breakdown).map(
          ([key, value]: any) => ({
            name: key,
            value,
          })
        );

        setPieData(formattedPie);

        // 🔥 TREND (line chart)
        const resTrend = await fetch(
          "https://smartexpense-api.onrender.com/api/v1/transactions/trend",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const trendData = await resTrend.json();
        console.log("TREND:", trendData);

        const trend =
          trendData.data || trendData;

        setLineData(Array.isArray(trend) ? trend : []);

      } catch (err) {
        console.error(err);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div className="space-y-6">
      {/* Title */}
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Balance"
          value={data.balance}
          gradient="bg-gradient-to-r from-[#3B82F6] to-[#2563EB]"
        />

        <StatCard
          title="Income"
          value={data.income}
          gradient="bg-gradient-to-r from-[#22C55E] to-[#16A34A]"
        />

        <StatCard
          title="Expenses"
          value={data.expenses}
          gradient="bg-gradient-to-r from-[#EF4444] to-[#DC2626]"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PieChartBox data={pieData} />
        <LineChartBox data={lineData} />
      </div>
    </div>
  );
}