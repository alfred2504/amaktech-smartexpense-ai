import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import type { ValueType } from "recharts/types/component/DefaultTooltipContent";

type Props = {
  data: { month: string; income: number; expense: number; net: number }[];
};

const moneyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export default function LineChartBox({ data }: Props) {
  const formatTooltip = (value: ValueType | undefined) => {
    return moneyFormatter.format(Number(value) || 0);
  };

  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-lg shadow-slate-900/5 dark:border-slate-700 dark:bg-slate-900">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Monthly Overview</h2>
        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-200">
          Trend
        </span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#CBD5E1" />

            <XAxis dataKey="month" tick={{ fill: "#64748B", fontSize: 12 }} />
            <YAxis tick={{ fill: "#64748B", fontSize: 12 }} />

            <Tooltip formatter={formatTooltip} />

            <Line
              type="monotone"
              dataKey="income"
              stroke="#22C55E"
              strokeWidth={3}
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="expense"
              stroke="#EF4444"
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 dark:border-emerald-400/30 dark:bg-emerald-500/10 dark:text-emerald-200">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Income
        </span>
        <span className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 dark:border-rose-400/30 dark:bg-rose-500/10 dark:text-rose-200">
          <span className="h-2 w-2 rounded-full bg-rose-500" />
          Expense
        </span>
      </div>
    </div>
  );
}