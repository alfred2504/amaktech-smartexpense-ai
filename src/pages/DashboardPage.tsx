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

  const [pieData, setPieData] = useState([
    { name: "Income", value: 0 },
    { name: "Expenses", value: 0 },
  ]);

  const [lineData, setLineData] = useState([
    { name: "Jan", income: 0, expenses: 0 },
    { name: "Feb", income: 0, expenses: 0 },
    { name: "Mar", income: 0, expenses: 0 },
  ]);

  useEffect(() => {
    // Mock data (replace with API later)
    const mock = {
      balance: 2450,
      income: 1800,
      expenses: 650,
    };

    setData(mock);

    setPieData([
      { name: "Income", value: mock.income },
      { name: "Expenses", value: mock.expenses },
    ]);

    setLineData([
      { name: "Jan", income: 500, expenses: 200 },
      { name: "Feb", income: 700, expenses: 300 },
      { name: "Mar", income: 600, expenses: 150 },
    ]);
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