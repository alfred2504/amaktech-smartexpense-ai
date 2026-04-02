import StatCard from "../components/StatCard";

export default function DashboardPage() {
  const data = {
    balance: 0,
    income: 0,
    expenses: 0,
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Cards (FORCED HORIZONTAL) */}
      <div className="grid grid-cols-3 gap-6">
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
    </div>
  );
}