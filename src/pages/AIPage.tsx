import { useEffect, useMemo, useState } from "react";
import type { KeyboardEvent } from "react";
import { API } from "../api/api";
import {
  FiAlertCircle,
  FiArrowUpRight,
  FiCpu,
  FiMessageCircle,
  FiSend,
  FiShield,
  FiZap,
} from "react-icons/fi";

type InsightSeverity = "info" | "warning" | "critical";

type Insight = {
  title: string;
  description: string;
  severity: InsightSeverity;
};

type ChatMessage = {
  role: "user" | "ai";
  text: string;
};

const toText = (value: unknown, fallback = ""): string => {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return fallback;
};

const toSeverity = (value: unknown): InsightSeverity => {
  const normalized = toText(value, "info").toLowerCase();
  if (normalized === "critical") return "critical";
  if (normalized === "warning") return "warning";
  return "info";
};

const severityMeta: Record<InsightSeverity, { label: string; card: string; badge: string; icon: typeof FiZap }> = {
  info: {
    label: "Insight",
    card: "border-cyan-200/70 bg-cyan-50/70 text-cyan-900 dark:border-cyan-500/20 dark:bg-cyan-500/10 dark:text-cyan-100",
    badge: "bg-cyan-100 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-300",
    icon: FiZap,
  },
  warning: {
    label: "Warning",
    card: "border-amber-200/70 bg-amber-50/70 text-amber-900 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-100",
    badge: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
    icon: FiAlertCircle,
  },
  critical: {
    label: "Critical",
    card: "border-rose-200/70 bg-rose-50/70 text-rose-900 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-100",
    badge: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
    icon: FiShield,
  },
};

export default function AIPage() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [summary, setSummary] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [insightsLoading, setInsightsLoading] = useState(true);
  const [insightsError, setInsightsError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setInsightsError(null);
        const res = await API.get("/ai/insights");
        const d = res.data?.data ?? res.data ?? {};
        const rawInsights = Array.isArray((d as Record<string, unknown>).insights)
          ? ((d as Record<string, unknown>).insights as unknown[])
          : [];

        setInsights(
          rawInsights.map((item) => {
            const record = item as Record<string, unknown>;
            return {
              title: toText(record.title, "Untitled insight"),
              description: toText(record.description, "No additional details available."),
              severity: toSeverity(record.severity),
            };
          })
        );
        setSummary(toText((d as Record<string, unknown>).summary, ""));
      } catch (err) {
        console.error("Insights error:", err);
        setInsights([]);
        setSummary("");
        setInsightsError("Unable to load AI insights right now.");
      } finally {
        setInsightsLoading(false);
      }
    };
    fetchInsights();
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = { role: "user", text: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await API.post("/ai/chat", { message: userMsg.text });
      const reply = toText(res.data?.data?.reply, "No response");
      setMessages((prev) => [...prev, { role: "ai", text: reply }]);
    } catch (err: any) {
      const msg = err.response?.data?.message || "AI error";
      setMessages((prev) => [...prev, { role: "ai", text: msg }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const stats = useMemo(() => {
    const critical = insights.filter((insight) => insight.severity === "critical").length;
    const warning = insights.filter((insight) => insight.severity === "warning").length;

    return {
      total: insights.length,
      critical,
      warning,
      healthy: Math.max(insights.length - critical - warning, 0),
    };
  }, [insights]);

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 px-6 py-7 text-white shadow-[0_24px_80px_-32px_rgba(15,23,42,0.85)] dark:border-white/10 sm:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.2),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.16),transparent_30%)]" />
        <div className="relative grid gap-8 lg:grid-cols-[1.35fr_0.9fr] lg:items-end">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-slate-200 backdrop-blur">
              <FiCpu className="text-sky-300" />
              AI insights engine
            </div>
            <div className="space-y-3">
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Actionable signals, not generic advice.</h1>
              <p className="max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                Detect risk, highlight trends, and get chat-assisted guidance based on your spending behavior.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Total signals</p>
                <p className="mt-2 text-2xl font-semibold text-sky-200">{stats.total}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Warnings</p>
                <p className="mt-2 text-2xl font-semibold text-amber-200">{stats.warning}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Critical</p>
                <p className="mt-2 text-2xl font-semibold text-rose-200">{stats.critical}</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-950/50 p-5 shadow-2xl backdrop-blur">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">System status</p>
                <p className="mt-2 text-3xl font-semibold text-white">{stats.healthy} stable</p>
              </div>
              <div className="rounded-2xl bg-sky-400/10 p-3 text-sky-300 ring-1 ring-sky-300/20">
                <FiArrowUpRight className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-5 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Risk ratio</span>
                <span>{stats.total === 0 ? 0 : Math.round(((stats.warning + stats.critical) / stats.total) * 100)}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-300"
                  style={{ width: `${stats.total === 0 ? 0 : Math.min(((stats.warning + stats.critical) / stats.total) * 100, 100)}%` }}
                />
              </div>
              <p className="text-sm text-slate-300">
                Prioritize critical cards first, then warning cards, for the highest impact improvements.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="space-y-4">
          <div className="rounded-3xl border border-slate-200/70 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900 sm:p-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Smart insights</h2>
            {summary ? <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{summary}</p> : null}

            {insightsError && (
              <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200">
                {insightsError}
              </div>
            )}

            {insightsLoading ? (
              <div className="mt-5 grid gap-3">
                {[0, 1, 2].map((skeleton) => (
                  <div key={skeleton} className="h-24 animate-pulse rounded-2xl bg-slate-100 dark:bg-white/5" />
                ))}
              </div>
            ) : insights.length === 0 ? (
              <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
                No insights yet. Check back after more transaction activity.
              </div>
            ) : (
              <div className="mt-5 space-y-3">
                {insights.map((insight, i) => {
                  const meta = severityMeta[insight.severity];
                  const Icon = meta.icon;

                  return (
                    <article
                      key={`${insight.title}-${i}`}
                      className={`rounded-2xl border p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${meta.card}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${meta.badge}`}>
                              {meta.label}
                            </span>
                          </div>
                          <h3 className="mt-2 text-base font-semibold text-slate-900 dark:text-white">{insight.title}</h3>
                          <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{insight.description}</p>
                        </div>
                        <div className="rounded-xl bg-white/60 p-2 text-slate-700 dark:bg-slate-950/40 dark:text-slate-200">
                          <Icon className="h-4 w-4" />
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <aside className="lg:sticky lg:top-6 lg:self-start">
          <div className="rounded-3xl border border-slate-200/70 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-300">Assistant chat</p>
                <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">Ask AI</h2>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Get recommendations for saving, budgeting, and anomaly checks.</p>
              </div>
              <div className="rounded-2xl bg-sky-50 p-3 text-sky-600 dark:bg-sky-500/10 dark:text-sky-300">
                <FiMessageCircle className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-5 h-72 space-y-3 overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/5">
              {messages.length === 0 && !loading ? (
                <p className="text-sm text-slate-500 dark:text-slate-400">Start with a question like "How can I reduce food expenses this month?"</p>
              ) : null}

              {messages.map((m, i) => (
                <div key={`${m.role}-${i}`} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-6 ${
                      m.role === "user"
                        ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                        : "bg-white text-slate-700 ring-1 ring-slate-200 dark:bg-slate-950/60 dark:text-slate-100 dark:ring-white/10"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="inline-flex items-center gap-2 rounded-2xl bg-white px-3 py-2 text-sm text-slate-500 ring-1 ring-slate-200 dark:bg-slate-950/60 dark:text-slate-300 dark:ring-white/10">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-sky-500" />
                  AI is typing...
                </div>
              )}
            </div>

            <div className="mt-4 flex gap-2">
              <input
                type="text"
                placeholder="Ask something useful..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500 dark:focus:bg-slate-900"
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
              >
                <FiSend className="h-4 w-4" />
                Send
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
