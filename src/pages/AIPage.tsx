import { useEffect, useRef, useState } from "react";
import { API } from "../api/api";

export default function AIPage() {
  const [insights, setInsights] = useState<any[]>([]);
  const [summary, setSummary] = useState("");
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [insightsLoading, setInsightsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const res = await API.get("/ai/insights");
        const d = res.data.data;
        setInsights(d.insights ?? []);
        setSummary(d.summary ?? "");
      } catch (err) {
        console.error("Insights error:", err);
      } finally {
        setInsightsLoading(false);
      }
    };
    fetchInsights();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const res = await API.post("/ai/chat", { message: userMsg.text });
      const reply = res.data.data.reply ?? "No response";
      setMessages((prev) => [...prev, { role: "ai", text: reply }]);
    } catch (err: any) {
      const msg = err.response?.data?.message || "AI error";
      setMessages((prev) => [...prev, { role: "ai", text: msg }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">AI Insights</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Insights */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
          <h2 className="font-semibold mb-3 text-gray-900 dark:text-white">Smart Insights</h2>

          {insightsLoading ? (
            <p className="text-gray-500">Loading insights...</p>
          ) : (
            <>
              {summary && (
                <p className="text-gray-700 dark:text-gray-300 mb-3 text-sm">{summary}</p>
              )}
              {insights.length === 0 ? (
                <p className="text-gray-500">No insights yet</p>
              ) : (
                <ul className="space-y-2">
                  {insights.map((insight, i) => (
                    <li
                      key={i}
                      className={`p-3 rounded text-sm ${
                        insight.severity === "warning"
                          ? "bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400"
                          : insight.severity === "critical"
                          ? "bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400"
                          : "bg-gray-100 dark:bg-gray-700"
                      }`}
                    >
                      <p className="font-medium text-gray-900 dark:text-white">{insight.title}</p>
                      <p className="text-gray-600 dark:text-gray-400">{insight.description}</p>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>

        {/* Chat */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
          <h2 className="font-semibold mb-3 text-gray-900 dark:text-white">Ask AI</h2>

          <div
            role="log"
            aria-label="Chat messages"
            aria-live="polite"
            className="h-[400px] mb-3 rounded-lg bg-gray-50 dark:bg-gray-900/30 p-3 overflow-y-auto space-y-2"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                role="article"
                aria-label={m.role === "user" ? "User message" : "AI message"}
                className={`p-2 rounded max-w-[85%] text-sm ${
                  m.role === "user"
                    ? "bg-blue-500 text-white ml-auto"
                    : "bg-gray-200 dark:bg-gray-700 dark:text-white"
                }`}
              >
                {m.text}
              </div>
            ))}
            {loading && <p className="text-sm text-gray-500">AI is typing...</p>}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask something..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 transition focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
