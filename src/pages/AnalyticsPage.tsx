import { useEffect, useMemo, useState } from "react";
import { API } from "../api/api";
import {
  FiArrowDownRight,
  FiArrowUpRight,
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

import type { ValueType } from "recharts/types/component/DefaultTooltipContent";

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

  const formatMoney = (value: number) =>
    moneyFormatter.format(Number.isFinite(value) ? value : 0);

  // ✅ FIXED formatter (TypeScript-safe for Recharts)
  const formatTooltip = (value: ValueType | undefined) => {
    return formatMoney(toNumber(value));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
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
      {/* ===== TOP SECTION ===== */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 px-6 py-7 text-white shadow-[0_24px_80px_-32px_rgba(15,23,42,0.85)] sm:px-8">

        {/* Summary Cards */}
        <div className="grid gap-3 sm:grid-cols-3">
          {summaryCards.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-300">{item.label}</p>
                  <Icon />
                </div>
                <p className="mt-2 text-xl">{formatMoney(item.value)}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===== CHARTS ===== */}
      <div className="grid gap-6 xl:grid-cols-2">
        {/* AREA CHART */}
        <div className="bg-white p-4 rounded-2xl">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={formatTooltip} />
              <Area type="monotone" dataKey="income" stroke="#10B981" />
              <Area type="monotone" dataKey="expense" stroke="#F43F5E" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* PIE CHART */}
        <div className="bg-white p-4 rounded-2xl">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={breakdown} dataKey="total" nameKey="category">
                {breakdown.map((_, index) => (
                  <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={formatTooltip} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
