import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { API } from "../api/api";
import {
  FiActivity,
  FiArrowDownLeft,
  FiArrowUpRight,
  FiCalendar,
  FiDollarSign,
  FiPlus,
  FiTag,
  FiTrash2,
} from "react-icons/fi";

type Transaction = {
  id: string;
  type: string;
  amount: number;
  category: string;
  description?: string;
  date?: string;
};

type RawTransaction = {
  id?: unknown;
  type?: unknown;
  amount?: unknown;
  category?: unknown;
  description?: unknown;
  date?: unknown;
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const moneyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const toText = (value: unknown, fallback = ""): string => {
  if (value === null || value === undefined) return fallback;
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);

  try {
    return JSON.stringify(value);
  } catch {
    return fallback;
  }
};

const toAmount = (value: unknown): number => {
  if (typeof value === "number" && Number.isFinite(value)) return value;

  if (typeof value === "string") {
    const cleaned = value.replace(/[^0-9.-]/g, "");
    const parsed = Number(cleaned);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown> & {
      toNumber?: () => unknown;
      valueOf?: () => unknown;
      toString?: () => string;
    };

    if (typeof record.toNumber === "function") {
      const numeric = toAmount(record.toNumber());
      if (Number.isFinite(numeric)) return numeric;
    }

    if (typeof record.valueOf === "function") {
      const primitive = record.valueOf();
      if (primitive !== value) {
        const numeric = toAmount(primitive);
        if (Number.isFinite(numeric)) return numeric;
      }
    }

    if (typeof record.toString === "function") {
      const text = record.toString();
      if (text && text !== "[object Object]") {
        const numeric = toAmount(text);
        if (Number.isFinite(numeric)) return numeric;
      }
    }

    const preferredKeys = ["amount", "value", "total", "$numberDecimal", "numberDecimal", "_value"];

    for (const key of preferredKeys) {
      if (key in record) {
        const parsed = toAmount(record[key]);
        if (Number.isFinite(parsed)) return parsed;
      }
    }
  }

  return 0;
};

const toDateText = (value: unknown): string => {
  const raw = toText(value, "");
  if (!raw) return "-";

  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return raw;

  return dateFormatter.format(parsed);
};

const normalizeTransaction = (item: RawTransaction): Transaction => {
  const category = toText(item.category, "Uncategorized");
  const description = toText(item.description, "");
  const typeRaw = toText(item.type, "EXPENSE");
  const normalizedType = typeRaw.toUpperCase() === "INCOME" ? "INCOME" : "EXPENSE";

  return {
    id: toText(item.id, `${Date.now()}-${Math.random()}`),
    type: normalizedType,
    amount: toAmount(item.amount),
    category,
    description,
    date: toDateText(item.date),
  };
};

const toTransactionsArray = (data: unknown): Transaction[] => {
  if (!data) return [];

  if (Array.isArray(data)) return data.map((item) => normalizeTransaction(item as RawTransaction));

  if (typeof data === "object") {
    const record = data as Record<string, unknown>;

    if (Array.isArray(record.items)) {
      return record.items.map((item) => normalizeTransaction(item as RawTransaction));
    }

    if (Array.isArray(record.transactions)) {
      return record.transactions.map((item) => normalizeTransaction(item as RawTransaction));
    }

    if (record.data) {
      return toTransactionsArray(record.data);
    }
  }

  return [];
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    type: "expense",
    amount: "",
    category: "",
    description: "",
    date: "",
  });

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await API.get("/transactions");
      setTransactions(toTransactionsArray(res.data?.data ?? res.data));
    } catch (err) {
      console.error("Fetch transactions error:", err);
      setTransactions([]);
      setError("Unable to load transactions right now.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.amount || !form.category || !form.date) {
      alert("Fill all required fields");
      return;
    }
    try {
      setSaving(true);
      setError(null);
      await API.post("/transactions", {
        type: form.type,
        amount: Number(form.amount),
        category: form.category,
        description: form.description,
        date: form.date,
      });
      setForm({ type: "expense", amount: "", category: "", description: "", date: "" });
      fetchTransactions();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to add transaction");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setError(null);
      await API.delete(`/transactions/${id}`);
      fetchTransactions();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete");
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const stats = useMemo(() => {
    const income = transactions
      .filter((item) => item.type === "INCOME")
      .reduce((sum, item) => sum + Math.abs(toAmount(item.amount)), 0);

    const expenses = transactions
      .filter((item) => item.type === "EXPENSE")
      .reduce((sum, item) => sum + Math.abs(toAmount(item.amount)), 0);

    return {
      income,
      expenses,
      net: income - expenses,
      count: transactions.length,
    };
  }, [transactions]);

  const orderedTransactions = useMemo(() => {
    const toDateValue = (value?: string) => {
      if (!value) return 0;

      const slashDate = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
      if (slashDate) {
        const [, day, month, year] = slashDate;
        return new Date(Number(year), Number(month) - 1, Number(day)).getTime();
      }

      const parsed = new Date(value).getTime();
      return Number.isNaN(parsed) ? 0 : parsed;
    };

    return [...transactions].sort((a, b) => toDateValue(b.date) - toDateValue(a.date));
  }, [transactions]);

  const formatMoney = (value: number) => moneyFormatter.format(Number.isFinite(value) ? value : 0);

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 px-6 py-7 text-white shadow-[0_24px_80px_-32px_rgba(15,23,42,0.85)] dark:border-white/10 sm:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.2),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.15),transparent_30%)]" />
        <div className="relative grid gap-8 lg:grid-cols-[1.35fr_0.9fr] lg:items-end">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-slate-200 backdrop-blur">
              <FiActivity className="text-emerald-300" />
              Transaction monitor
            </div>
            <div className="space-y-3">
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Cash flow that reads clearly in one glance.</h1>
              <p className="max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                Review inflow, outflow, and your net position without scanning every row manually.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Income</p>
                <p className="mt-2 text-2xl font-semibold text-emerald-200">{formatMoney(stats.income)}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Expenses</p>
                <p className="mt-2 text-2xl font-semibold text-rose-200">{formatMoney(stats.expenses)}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Transactions</p>
                <p className="mt-2 text-2xl font-semibold">{stats.count}</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-950/50 p-5 shadow-2xl backdrop-blur">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Net balance</p>
                <p className={`mt-2 text-3xl font-semibold ${stats.net >= 0 ? "text-emerald-200" : "text-rose-200"}`}>
                  {stats.net >= 0 ? "+" : "-"}
                  {formatMoney(Math.abs(stats.net))}
                </p>
              </div>
              <div className="rounded-2xl bg-emerald-400/10 p-3 text-emerald-300 ring-1 ring-emerald-300/20">
                <FiDollarSign className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-5 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Expense ratio</span>
                <span>{stats.income === 0 ? 0 : Math.min(Math.round((stats.expenses / stats.income) * 100), 999)}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-sky-300"
                  style={{ width: `${stats.income === 0 ? 0 : Math.min((stats.expenses / stats.income) * 100, 100)}%` }}
                />
              </div>
              <p className="text-sm text-slate-300">Numbers are now based on real amounts, not record counts.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.9fr]">
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Latest activity</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Income and expense entries ordered by most recent date.</p>
            </div>
            <div className="hidden rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-white/5 dark:text-slate-300 sm:block">
              {stats.count} records
            </div>
          </div>

          {error && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200">
              {error}
            </div>
          )}

          {loading ? (
            <div className="grid gap-4">
              {[0, 1, 2].map((index) => (
                <div
                  key={index}
                  className="h-32 animate-pulse rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900"
                >
                  <div className="h-4 w-24 rounded-full bg-slate-200 dark:bg-slate-700" />
                  <div className="mt-4 h-6 w-40 rounded-full bg-slate-200 dark:bg-slate-700" />
                  <div className="mt-4 h-3 w-2/3 rounded-full bg-slate-200 dark:bg-slate-700" />
                </div>
              ))}
            </div>
          ) : orderedTransactions.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white/80 p-8 text-center shadow-sm dark:border-white/10 dark:bg-slate-900/60">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300">
                <FiCalendar className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">No transactions yet</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Add your first income or expense entry from the form panel.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {orderedTransactions.map((transaction) => {
                const isIncome = transaction.type === "INCOME";
                const amount = Math.abs(toAmount(transaction.amount));

                return (
                  <article
                    key={transaction.id}
                    className="rounded-3xl border border-slate-200/70 bg-white p-5 shadow-sm ring-1 ring-transparent transition hover:-translate-y-0.5 hover:shadow-lg dark:border-white/10 dark:bg-slate-900"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${isIncome ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300" : "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300"}`}>
                            {isIncome ? "Income" : "Expense"}
                          </span>
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:bg-white/5 dark:text-slate-300">
                            {transaction.category}
                          </span>
                        </div>

                        <div>
                          <h3 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
                            {transaction.description || transaction.category}
                          </h3>
                          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{transaction.date || "-"}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className={`inline-flex items-center gap-2 rounded-2xl px-4 py-3 ${isIncome ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200" : "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-200"}`}>
                          {isIncome ? <FiArrowUpRight className="h-4 w-4" /> : <FiArrowDownLeft className="h-4 w-4" />}
                          <p className="text-base font-semibold">
                            {isIncome ? "+" : "-"}
                            {formatMoney(amount)}
                          </p>
                        </div>

                        <button
                          onClick={() => handleDelete(transaction.id)}
                          className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-white/10 dark:text-slate-300 dark:hover:border-red-500/20 dark:hover:bg-red-500/10 dark:hover:text-red-200"
                          aria-label="Delete transaction"
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <aside className="lg:sticky lg:top-6 lg:self-start">
          <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200/70 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-300">Add transaction</p>
                <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">Record money movement</h2>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Keep categories and amounts consistent so reports stay useful.
                </p>
              </div>
              <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300">
                <FiPlus className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Type</span>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:bg-slate-900"
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Amount</span>
                <div className="relative">
                  <FiDollarSign className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="120"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500 dark:focus:bg-slate-900"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Category</span>
                <div className="relative">
                  <FiTag className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Food, Salary, Transport..."
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500 dark:focus:bg-slate-900"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Description</span>
                <input
                  type="text"
                  placeholder="Optional note"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500 dark:focus:bg-slate-900"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Date</span>
                <div className="relative">
                  <FiCalendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-slate-900 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:bg-slate-900"
                  />
                </div>
              </label>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
              >
                <FiPlus className="h-4 w-4" />
                {saving ? "Saving transaction..." : "Save transaction"}
              </button>
            </div>
          </form>
        </aside>
      </div>
    </div>
  );
}
