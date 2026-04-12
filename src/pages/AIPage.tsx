import { useEffect, useState } from "react";

export default function AIPage() {
  const [insights, setInsights] = useState<string[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // 🔥 FETCH AI INSIGHTS
  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const res = await fetch(
          "https://smartexpense-api.onrender.com/api/v1/ai/insights",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        console.log("INSIGHTS:", data);

        const result =
          data.data?.insights ||
          data.data ||
          data.insights ||
          [];

        setInsights(Array.isArray(result) ? result : []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchInsights();
  }, []);

  // 🔥 SEND CHAT MESSAGE
  const sendMessage = async () => {
    if (!input) return;

    const userMessage = { role: "user", text: input };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(
        "https://smartexpense-api.onrender.com/api/v1/ai/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ message: userMessage.text }),
        }
      );

      const data = await res.json();
      console.log("AI RESPONSE:", data);

      const reply =
        data.data?.reply ||
        data.reply ||
        "No response";

      setMessages((prev) => [
        ...prev,
        { role: "ai", text: reply },
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">AI Insights</h1>

      {/* 🔥 INSIGHTS */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
        <h2 className="font-semibold mb-3 text-gray-900 dark:text-white">
          Smart Insights
        </h2>

        {insights.length === 0 ? (
          <p className="text-gray-500">No insights yet</p>
        ) : (
          <ul className="space-y-2">
            {insights.map((i, index) => (
              <li
                key={index}
                className="p-2 bg-gray-100 dark:bg-gray-700 rounded"
              >
                💡 {i}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 🔥 CHAT */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
        <h2 className="font-semibold mb-3 text-gray-900 dark:text-white">
          Ask AI
        </h2>

        <div className="h-60 overflow-y-auto space-y-2 mb-3">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`p-2 rounded max-w-xs ${
                m.role === "user"
                  ? "bg-blue-500 text-white ml-auto"
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
            >
              {m.text}
            </div>
          ))}

          {loading && (
            <p className="text-sm text-gray-500">
              AI is typing...
            </p>
          )}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Ask something..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 border p-2 rounded dark:bg-gray-700 dark:text-white"
          />

          <button
            onClick={sendMessage}
            className="bg-blue-600 text-white px-4 rounded"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}