import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { ValueType } from "recharts/types/component/DefaultTooltipContent";

type Props = {
  data: { name: string; value: number }[];
};

const COLORS = ["#3B82F6", "#22C55E", "#EF4444"];

const moneyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export default function PieChartBox({ data }: Props) {
  const formatTooltip = (value: ValueType | undefined) => {
    return moneyFormatter.format(Number(value) || 0);
  };

  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-lg shadow-slate-900/5 dark:border-slate-700 dark:bg-slate-900">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Spending Breakdown</h2>
        <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-200">
          Categories
        </span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              outerRadius={86}
              innerRadius={52}
              label
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip formatter={formatTooltip} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}