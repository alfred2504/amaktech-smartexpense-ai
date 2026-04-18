mmport  useEffect, useMemo, useState } from "react";
import { API } from "../api/api";
import {
  FiActivity,
  FiArrowDownRight,
  FiArrowUpRight,
  FiBarChart2,
  FiPieChart,
  FiTrendingUp,
} from "react-icons/fi";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Summary = {
  totalIncome: number;
  totalExpense: number;
  balance: number;
};

type BreakdownItem = {
  category: string;
  total: number;
  percentage: number;
};

type TrendItem = {
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

const PIE_COLORS = [
  "#0284C7",
  "#0EA5E9",
  "#22D3EE",
  "#14B8A6",
  "#10B981",
  "#84CC16",
  "#F59E0B",
  "#F97316",
];

const toNumber = (value: unknown): number => {
  if (typeof value === "number" && Number.isFinite(value)) return value;

  if (typeof value === "string") {
    const cleaned = value.replace(/[^0-9.-]/g, "");
    const parsed = Number(cleaned);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    const keys = ["amount", "value", "total", "$numberDecimal", "numberDecimal", "_value"];

    for (const key of keys) {
      if (key in record) {
        const parsed = toNumber(record[key]);
        if (Number.isFinite(parsed)) return parsed;
      }
    }
  }

  return 0;
};

const toText = (value: unknown, fallback = ""): string => {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return fallback;
};

export default function AnalyticsPage() {
  const [summary, setSummary] = useState<Summary>({ totalIncome: 0, totalExpense: 0, balance: 0 });
  const [breakdown, setBreakdown] = useState<BreakdownItem[]>([]);
  const [trend, setTrend] = useState<TrendItem[]>([]);
  const [loading, setLoading] = useState(true);

  const formatMoney = (value: number) => moneyFormatter.format(Number.isFinite(value) ? value : 0);

  // Recharts Tooltip formatter value is not always a number (can be string/array/etc),
  // so accept unknown and coerce safely.
  const formatTooltip = (value: unknown) => formatMoney(toNumber(value));

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [resSummary, resBreakdown, resTrend] = await Promise.all([
          API.get("/transactions/summary"),
          API.get("/transactions/breakdown"),
          API.get("/transactions/trend"),
        ]);

        const summaryRaw = resSummary.data?.data?.summary ?? resSummary.data?.summary ?? {};
        const breakdownRaw = resBreakdown.data?.data?.breakdown ?? resBreakdown.data?.breakdown ?? [];
        const trendRaw = resTrend.data?.data?.trend ?? resTrend.data?.trend ?? [];

        setSummary({
          totalIncome: toNumber((summaryRaw as Record<string, unknown>).totalIncome),
          totalExpense: toNumber((summaryRaw as Record<string, unknown>).totalExpense),
          balance: toNumber((summaryRaw as Record<string, unknown>).balance),
        });

        setBreakdown(
          Array.isArray(breakdownRaw)
            ? breakdownRaw.map((item) => {
                const record = item as Record<string, unknown>;
                return {
                  category: toText(record.category, "Uncategorized"),
                  total: toNumber(record.total),
                  percentage: toNumber(record.percentage),
                };
              })
            : []
        );

        setTrend(
          Array.isArray(trendRaw)
            ? trendRaw.map((item) => {
                const record = item as Record<string, unknown>;
                return {
                  month: toText(record.month, "N/A"),
                  income: toNumber(record.income),
                  expense: toNumber(record.expense),
                  net: toNumber(record.net),
                };
              })
            : []
        );
      } catch (err) {
        console.error("Analytics fetch error:", err);
        setSummary({ totalIncome: 0, totalExpense: 0, balance: 0 });
        setBreakdown([]);
        setTrend([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const summaryCards = useMemo(
    () => [
      {
        label: "Income",
        value: summary.totalIncome,
        icon: FiArrowUpRight,
        valueClass: "text-emerald-200",
        chipClass: "bg-emerald-400/10 text-emerald-300 ring-emerald-300/20",
      },
      {
        label: "Expenses",
        value: summary.totalExpense,
        icon: FiArrowDownRight,
        valueClass: "text-rose-200",
        chipClass: "bg-rose-400/10 text-rose-300 ring-rose-300/20",
      },
      {
        label: "Balance",
        value: summary.balance,
        icon: FiTrendingUp,
        valueClass: summary.balance >= 0 ? "text-cyan-200" : "text-rose-200",
        chipClass: "bg-cyan-400/10 text-cyan-300 ring-cyan-300/20",
      },
    ],
    [summary]
  );

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 px-6 py-7 text-white shadow-[0_24px_80px_-32px_rgba(15,23,42,0.85)] sm:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.2),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.18),transparent_30%)]" />
        <div className="relative grid gap-8 lg:grid-cols-[1.35fr_0.9fr] lg:items-end">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-slate-200 backdrop-blur">
              <FiActivity className="text-cyan-300" />
              Financial analytics
            </div>
            <div className="space-y-3">
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Insights that show where your money is actually moving.
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                Scan trend direction, category concentration, and your current runway in one screen.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {summaryCards.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-300">{item.label}</p>
                      <span className={`rounded-xl p-2 ring-1 ${item.chipClass}`}>
                        <Icon className="h-4 w-4" />
                      </span>
                    </div>
                    <p className={`mt-3 text-2xl font-semibold ${item.valueClass}`}>{formatMoney(item.value)}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-950/50 p-5 shadow-2xl backdrop-blur">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Expense pressure</p>
                <p className="mt-2 text-3xl font-semibold text-white">
                  {summary.totalIncome === 0
                    ? 0
                    : Math.min(Math.round((summary.totalExpense / summary.totalIncome) * 100), 999)}
                  %
                </p>
              </div>
              <div className="rounded-2xl bg-cyan-400/10 p-3 text-cyan-300 ring-1 ring-cyan-300/20">
                <FiBarChart2 className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-5 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Expenses vs income</span>
                <span>
                  {summary.totalIncome === 0
                    ? 0
                    : Math.min(Math.round((summary.totalExpense / summary.totalIncome) * 100), 999)}
                  %
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-teal-300"
                  style={{
                    width: `${
                      summary.totalIncome === 0
                        ? 0
                        : Math.min((summary.totalExpense / summary.totalIncome) * 100, 100)
                    }%`,
                  }}
                />
              </div>
              <p className="text-sm text-slate-300">
                {summary.balance >= 0
                  ? "Your income is currently covering expenses."
                  : "Expenses are currently outpacing income. Review category spikes below."}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-3xl border border-slate-200/70 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Monthly trend</h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Income and expenses over time, with net movement for each month.
              </p>
            </div>
            <div className="rounded-2xl bg-cyan-50 p-3 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-300">
              <FiTrendingUp className="h-5 w-5" />
            </div>
          </div>

          {loading ? (
            <div className="mt-6 h-72 animate-pulse rounded-2xl bg-slate-100 dark:bg-white/5" />
          ) : trend.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
              No trend data yet.
            </div>
          ) : (
            <div className="mt-6 h-72 w-full">
              <ResponsiveContainer>
                <AreaChart data={trend} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
                  <defs>
                    <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#F43F5E" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#CBD5E1" opacity={0.45} />
                  <XAxis dataKey="month" tick={{ fill: "#64748B", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#64748B", fontSize: 12 }} axisLine={false} tickLine={false} width={44} />
                  <Tooltip
                    contentStyle={{ borderRadius: 14, border: "1px solid #E2E8F0", backgroundColor: "#FFFFFF" }}
                    formatter={formatTooltip}
                  />
                  <Area
                    type="monotone"
                    dataKey="income"
                    stroke="#10B981"
                    fill="url(#incomeGradient)"
                    strokeWidth={2.5}
                  />
                  <Area
                    type="monotone"
                    dataKey="expense"
                    stroke="#F43F5E"
                    fill="url(#expenseGradient)"
                    strokeWidth={2.5}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>

        <section className="rounded-3xl border border-slate-200/70 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Category breakdown</h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                See where spending is concentrated and which category dominates.
              </p>
            </div>
            <div className="rounded-2xl bg-sky-50 p-3 text-sky-600 dark:bg-sky-500/10 dark:text-sky-300">
              <FiPieChart className="h-5 w-5" />
            </div>
          </div>

          {loading ? (
            <div className="mt-6 h-72 animate-pulse rounded-2xl bg-slate-100 dark:bg-white/5" />
          ) : breakdown.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
              No category data yet.
            </div>
          ) : (
            <div className="mt-6 space-y-5">
              <div className="h-52 w-full">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={breakdown}
                      dataKey="total"
                      nameKey="category"
                      innerRadius={52}
                      outerRadius={84}
                      paddingAngle={3}
                    >
                      {breakdown.map((item, index) => (
                        <Cell key={`${item.category}-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ borderRadius: 14, border: "1px solid #E2E8F0", backgroundColor: "#FFFFFF" }}
                      formatter={formatTooltip}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-3">
                {breakdown.map((item, index) => (
                  <div key={`${item.category}-${index}`} className="space-y-2">
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <div className="flex min-w-0 items-center gap-2 text-slate-700 dark:text-slate-200">
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                        />
                        <span className="truncate capitalize">{item.category}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-slate-900 dark:text-white">{formatMoney(item.total)}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {Math.max(0, Math.round(item.percentage))}%
                        </p>
                      </div>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/5">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.max(0, Math.min(item.percentage, 100))}%`,
                          backgroundColor: PIE_COLORS[index % PIE_COLORS.length],
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>

      {!loading && trend.length > 0 && (
        <section className="rounded-3xl border border-slate-200/70 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900 sm:p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Monthly snapshot</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            A compact month-by-month ledger for quick comparisons.
          </p>

          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm dark:divide-white/10">
              <thead>
                <tr className="text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                  <th className="px-3 py-3 font-medium">Month</th>
                  <th className="px-3 py-3 font-medium">Income</th>
                  <th className="px-3 py-3 font-medium">Expense</th>
                  <th className="px-3 py-3 font-medium">Net</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {trend.map((item, index) => (
                  <tr key={`${item.month}-${index}`} className="text-slate-700 dark:text-slate-200">
                    <td className="px-3 py-3 font-medium">{item.month}</td>
                    <td className="px-3 py-3 text-emerald-600 dark:text-emerald-300">{formatMoney(item.income)}</td>
                    <td className="px-3 py-3 text-rose-600 dark:text-rose-300">{formatMoney(item.expense)}</td>
                    <td
                      className={`px-3 py-3 font-semibold ${
                        item.net >= 0 ? "text-cyan-600 dark:text-cyan-300" : "text-rose-600 dark:text-rose-300"
                      }`}
                    >
                      {item.net >= 0 ? "+" : "-"}
                      {formatMoney(Math.abs(item.net))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
```
