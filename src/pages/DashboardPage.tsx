export default function DashboardPage() {
  const dashboardData = {
    balance: 0,
    income: 0,
    expenses: 0,
  };

  return (
    <div>
      <h1>Dashboard</h1>

      {/* Cards (structure only) */}
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div>Balance: {dashboardData.balance}</div>
        <div>Income: {dashboardData.income}</div>
        <div>Expenses: {dashboardData.expenses}</div>
      </div>
    </div>
  );
}