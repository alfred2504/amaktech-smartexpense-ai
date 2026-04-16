import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { API } from "../api/api";
import {
  FiAlertTriangle,
  FiCalendar,
  FiClock,
  FiDollarSign,
  FiPlus,
  FiTag,
  FiTrash2,
} from "react-icons/fi";

type Budget = {
  id: string;
  category: string;
  limit: number;
  spent: number;
  period: string;
  status: string;
  percentageUsed: number;
  daysLeft?: number;
  isExceeded?: boolean;
  startDate?: string;
  endDate?: string;
};

type BudgetForm = {
  category: string;
  limit: string;
  period: string;
  startDate: string;
  endDate: string;
};

const moneyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const statusStyles: Record<string, { label: string; badge: string; ring: string; bar: string }> = {
  healthy: {
    label: "On track",
    badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
    ring: "ring-emerald-200/70 dark:ring-emerald-500/20",
    bar: "from-emerald-500 via-lime-400 to-emerald-400",
  },
  warning: {
    label: "Watch closely",
    badge: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
    ring: "ring-amber-200/70 dark:ring-amber-500/20",
    bar: "from-amber-500 via-orange-400 to-amber-300",
  },
  critical: {
    label: "Near limit",
    badge: "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300",
    ring: "ring-orange-200/70 dark:ring-orange-500/20",
    bar: "from-orange-500 via-rose-400 to-red-400",
  },
  exceeded: {
    label: "Exceeded",
    badge: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300",
    ring: "ring-red-200/70 dark:ring-red-500/20",
    bar: "from-red-500 via-rose-500 to-orange-400",
  },
};

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [form, setForm] = useState<BudgetForm>({
    category: "",
    limit: "",
    period: "MONTHLY",
    startDate: "",
    endDate: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBudgets = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await API.get("/budgets");
      setBudgets((res.data.data.budgets ?? []) as Budget[]);
    } catch (err) {
      console.error("Fetch budgets error:", err);
      setError("We could not load budgets right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.category || !form.limit || !form.startDate || !form.endDate) {
      setError("Please fill in every budget field before saving.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await API.post("/budgets", {
        category: form.category,
        limit: Number(form.limit),
        period: form.period,
        startDate: new Date(form.startDate).toISOString(),
        endDate: new Date(form.endDate).toISOString(),
      });
      setForm({ category: "", limit: "", period: "MONTHLY", startDate: "", endDate: "" });
      fetchBudgets();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create budget");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await API.delete(`/budgets/${id}`);
      fetchBudgets();
    } catch (err: any) {
      setError(err.response?.data?.message || "Delete failed");
    }
  };

  const stats = useMemo(() => {
    const totalLimit = budgets.reduce((sum, budget) => sum + Number(budget.limit || 0), 0);
    const totalSpent = budgets.reduce((sum, budget) => sum + Number(budget.spent || 0), 0);
    const remaining = Math.max(totalLimit - totalSpent, 0);
    const watchlist = budgets.filter((budget) => budget.status === "warning" || budget.status === "critical" || budget.status === "exceeded").length;

    return { totalLimit, totalSpent, remaining, watchlist };
  }, [budgets]);

  const formatMoney = (value: number) => moneyFormatter.format(Number.isFinite(value) ? value : 0);

  const formatDate = (value?: string) => {
    if (!value) return "";

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return value;
    }

    return dateFormatter.format(parsed);
  };

  const getStatusMeta = (status: string) => statusStyles[status] ?? statusStyles.healthy;

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 px-6 py-7 text-white shadow-[0_24px_80px_-32px_rgba(15,23,42,0.85)] dark:border-white/10 sm:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.16),transparent_30%)]" />
        <div className="relative grid gap-8 lg:grid-cols-[1.35fr_0.9fr] lg:items-end">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-slate-200 backdrop-blur">
              <FiTag className="text-cyan-300" />
              Budget planning
            </div>
            <div className="space-y-3">
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Budgets that feel easy to scan and hard to ignore.</h1>
              <p className="max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                Track what is allocated, what has already been spent, and where you need to intervene before a category tips over.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Allocated</p>
                <p className="mt-2 text-2xl font-semibold">{formatMoney(stats.totalLimit)}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Spent</p>
                <p className="mt-2 text-2xl font-semibold">{formatMoney(stats.totalSpent)}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-300">At risk</p>
                <p className="mt-2 text-2xl font-semibold">{stats.watchlist}</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-950/50 p-5 shadow-2xl backdrop-blur">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Current cushion</p>
                <p className="mt-2 text-3xl font-semibold text-white">{formatMoney(stats.remaining)}</p>
              </div>
              <div className="rounded-2xl bg-cyan-400/10 p-3 text-cyan-300 ring-1 ring-cyan-300/20">
                <FiDollarSign className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-5 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Budget pressure</span>
                <span>{stats.totalLimit === 0 ? 0 : Math.min(Math.round((stats.totalSpent / stats.totalLimit) * 100), 100)}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-lime-300"
                  style={{ width: `${stats.totalLimit === 0 ? 0 : Math.min((stats.totalSpent / stats.totalLimit) * 100, 100)}%` }}
                />
              </div>
              <p className="text-sm text-slate-300">Healthy budgets are easy to spot. Problem budgets are impossible to miss.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.9fr]">
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Budget overview</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Each card summarizes category spending, status, and time left.</p>
            </div>
            <div className="hidden rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-white/5 dark:text-slate-300 sm:block">
              {budgets.length} active
            </div>
          </div>

          {error && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {loading ? (
              <div className="grid gap-4">
                {[0, 1, 2].map((index) => (
                  <div
                    key={index}
                    className="h-40 animate-pulse rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900"
                  >
                    <div className="h-4 w-24 rounded-full bg-slate-200 dark:bg-slate-700" />
                    <div className="mt-4 h-6 w-40 rounded-full bg-slate-200 dark:bg-slate-700" />
                    <div className="mt-6 h-3 w-full rounded-full bg-slate-200 dark:bg-slate-700" />
                    <div className="mt-3 h-3 w-2/3 rounded-full bg-slate-200 dark:bg-slate-700" />
                  </div>
                ))}
              </div>
            ) : budgets.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white/80 p-8 text-center shadow-sm dark:border-white/10 dark:bg-slate-900/60">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
                  <FiCalendar className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">No budgets yet</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Create your first budget on the right to start tracking category-level spending.
                </p>
              </div>
            ) : (
              budgets.map((budget) => {
                const status = getStatusMeta(budget.status);
                const used = Math.max(0, Math.min(Number(budget.percentageUsed || 0), 100));
                const progressLabel = budget.isExceeded ? "Over budget" : `${Math.round(used)}% used`;

                return (
                  <article
                    key={budget.id}
                    className={`rounded-3xl border border-slate-200/70 bg-white p-5 shadow-sm ring-1 ring-transparent transition hover:-translate-y-0.5 hover:shadow-lg dark:border-white/10 dark:bg-slate-900 ${status.ring}`}
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:bg-white/5 dark:text-slate-300">
                            {budget.period}
                          </span>
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${status.badge}`}>
                            {status.label}
                          </span>
                        </div>

                        <div>
                          <h3 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">{budget.category}</h3>
                          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            {budget.startDate && budget.endDate
                              ? `${formatDate(budget.startDate)} to ${formatDate(budget.endDate)}`
                              : "Custom period in effect"}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDelete(budget.id)}
                        className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-white/10 dark:text-slate-300 dark:hover:border-red-500/20 dark:hover:bg-red-500/10 dark:hover:text-red-200"
                      >
                        <FiTrash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>

                    <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                          <span>{formatMoney(Number(budget.spent || 0))} spent</span>
                          <span>{formatMoney(Number(budget.limit || 0))} limit</span>
                        </div>
                        <div className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-white/5">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${status.bar}`}
                            style={{ width: `${used}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                          <span>{progressLabel}</span>
                          <span>{budget.daysLeft ?? 0} days left</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3 dark:bg-white/5">
                        <FiClock className="h-4 w-4 text-slate-400" />
                        <div>
                          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Remaining</p>
                          <p className="text-base font-semibold text-slate-900 dark:text-white">
                            {formatMoney(Math.max(Number(budget.limit || 0) - Number(budget.spent || 0), 0))}
                          </p>
                        </div>
                      </div>
                    </div>

                    {budget.isExceeded && (
                      <div className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200">
                        <FiAlertTriangle className="h-4 w-4" />
                        Budget exceeded. Consider tightening this category now.
                      </div>
                    )}
                  </article>
                );
              })
            )}
          </div>
        </section>

        <aside className="lg:sticky lg:top-6 lg:self-start">
          <form onSubmit={handleAdd} className="rounded-3xl border border-slate-200/70 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-500 dark:text-indigo-300">Create budget</p>
                <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">Set a spending guardrail</h2>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Keep this focused. A good budget name should be obvious at a glance.
                </p>
              </div>
              <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
                <FiPlus className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Category</span>
                <div className="relative">
                  <FiTag className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Food, Rent, Travel..."
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500 dark:focus:bg-slate-900"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Limit</span>
                <div className="relative">
                  <FiDollarSign className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="number"
                    min="0"
                    step="1"
                    placeholder="250"
                    value={form.limit}
                    onChange={(e) => setForm({ ...form, limit: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500 dark:focus:bg-slate-900"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Period</span>
                <select
                  value={form.period}
                  onChange={(e) => setForm({ ...form, period: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:bg-slate-900"
                >
                  <option value="WEEKLY">Weekly</option>
                  <option value="MONTHLY">Monthly</option>
                  <option value="YEARLY">Yearly</option>
                </select>
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Start date</span>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:bg-slate-900"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">End date</span>
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:bg-slate-900"
                  />
                </label>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
              >
                <FiPlus className="h-4 w-4" />
                {saving ? "Saving budget..." : "Save budget"}
              </button>
            </div>
          </form>
        </aside>
      </div>
    </div>
  );
}
