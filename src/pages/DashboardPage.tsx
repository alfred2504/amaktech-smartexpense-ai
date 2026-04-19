import { useEffect, useState } from "react";
import PieChartBox from "../components/PieChartBox";
import LineChartBox from "../components/LineChartBox";
import { API } from "../api/api";
import { FiArrowDownRight, FiArrowUpRight, FiTarget } from "react-icons/fi";

type Summary = {
  balance: number;
  income: number;
  expenses: number;
};

type PiePoint = {
  name: string;
  value: number;
};

type TrendPoint = {
  month: string;
  income: number;
  expense: number;
  net: number;
};

const moneyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const toNumber = (value: unknown): number => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
};

export default function DashboardPage() {
  const [summary, setSummary] = useState<Summary>({ balance: 0, income: 0, expenses: 0 });
  const [pieData, setPieData] = useState<PiePoint[]>([]);
  const [lineData, setLineData] = useState<TrendPoint[]>([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const resSummary = await API.get("/transactions/summary");
        const s = resSummary.data?.data?.summary ?? {};
        setSummary({
          balance: toNumber((s as Record<string, unknown>).balance),
          income: toNumber((s as Record<string, unknown>).totalIncome),
          expenses: toNumber((s as Record<string, unknown>).totalExpense),
        });

        const resBreakdown = await API.get("/transactions/breakdown");
        const breakdownRaw = resBreakdown.data?.data?.breakdown ?? [];
        const breakdown = Array.isArray(breakdownRaw) ? breakdownRaw : [];
        setPieData(
          breakdown.map((b) => {
            const item = b as Record<string, unknown>;
            return {
              name: typeof item.category === "string" ? item.category : "Uncategorized",
              value: toNumber(item.total),
            };
          })
        );

        const resTrend = await API.get("/transactions/trend");
        const trendRaw = resTrend.data?.data?.trend ?? [];
        const trend = Array.isArray(trendRaw) ? trendRaw : [];
        setLineData(
          trend.map((point) => {
            const item = point as Record<string, unknown>;
            return {
              month: typeof item.month === "string" ? item.month : "N/A",
              income: toNumber(item.income),
              expense: toNumber(item.expense),
              net: toNumber(item.net),
            };
          })
        );
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      }
    };

    fetchDashboard();
  }, []);

  const savingsRate =
    summary.income > 0 ? Math.max(0, Math.round(((summary.income - summary.expenses) / summary.income) * 100)) : 0;

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 px-6 py-7 text-white shadow-[0_24px_80px_-32px_rgba(15,23,42,0.85)] sm:px-8">
        <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-cyan-300/15 blur-3xl" />
        <div className="absolute -bottom-16 left-20 h-48 w-48 rounded-full bg-blue-400/15 blur-3xl" />
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-200">SmartExpense Dashboard</p>
            <h1 className="mt-2 text-2xl font-black sm:text-3xl">Your Financial Pulse Today</h1>
            <p className="mt-2 max-w-xl text-sm text-slate-300 sm:text-base">
              Monitor balances, analyze spending patterns, and keep your monthly goals in check.
            </p>
          </div>

          <div className="rounded-2xl border border-cyan-300/20 bg-white/10 px-4 py-3 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.12em] text-cyan-200">Savings Rate</p>
            <p className="mt-1 text-2xl font-black text-cyan-100">{savingsRate}%</p>
          </div>
        </div>

        <div className="relative z-10 mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-white/10 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.12em] text-slate-300">Balance</p>
            <p className="mt-1 text-lg font-bold">{moneyFormatter.format(summary.balance)}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/10 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.12em] text-slate-300">Income</p>
            <p className="mt-1 flex items-center gap-2 text-lg font-bold text-emerald-200">
              <FiArrowUpRight />
              {moneyFormatter.format(summary.income)}
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/10 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.12em] text-slate-300">Expenses</p>
            <p className="mt-1 flex items-center gap-2 text-lg font-bold text-rose-200">
              <FiArrowDownRight />
              {moneyFormatter.format(summary.expenses)}
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center gap-2">
          <FiTarget className="text-slate-600" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Spending Insights</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <PieChartBox data={pieData} />
          <LineChartBox data={lineData} />
        </div>
      </section>
    </div>
  );
}
