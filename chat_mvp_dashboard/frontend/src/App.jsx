import React, { useState, useRef, useEffect } from "react";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current)
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages, loading]);

  const send = async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", text: input, ts: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setLogs((prev) => [
      {
        level: "out",
        text: JSON.stringify({ userId: "test", message: input }),
      },
      ...prev,
    ]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: "test", message: input }),
      });
      const json = await res.json();
      const reply = json.reply ?? "Sem resposta";
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: reply, ts: Date.now() },
      ]);
      setLogs((prev) => [{ level: "in", text: JSON.stringify(json) }, ...prev]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Erro ao conectar com o webhook", ts: Date.now() },
      ]);
      setLogs((prev) => [{ level: "err", text: String(err) }, ...prev]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex">
      <aside className="w-72 bg-gray-800 p-4 border-r border-gray-700">
        <h2 className="text-xl font-bold mb-2">ChatBot CentralEng</h2>
        <p className="text-sm text-gray-300 mb-4">Chat RAG — MVP ChatBot</p>
        <div className="mb-3">
          <div className="text-xs text-gray-400">Webhook (proxy):</div>
          <div className="text-sm text-green-400">
            http://localhost:3000/api/chat
          </div>
        </div>
        <div className="text-xs text-gray-400 mb-2">Últimos logs</div>
        <div className="h-64 overflow-auto bg-gray-900 p-2 rounded">
          {logs.length === 0 && (
            <div className="text-sm text-gray-500">Sem logs ainda</div>
          )}
          {logs.map((l, i) => (
            <div
              key={i}
              className={
                "mb-2 text-xs " +
                (l.level === "err" ? "text-red-400" : "text-gray-300")
              }
            >
              <div className="font-mono">{l.text}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-sm text-gray-400">
          Status:{" "}
          {loading ? (
            <span className="text-yellow-300">Digitando...</span>
          ) : (
            <span className="text-green-300">Pronto</span>
          )}
        </div>
      </aside>
      <main className="flex-1 p-6 flex flex-col">
        <div className="flex-1 overflow-auto mb-4" ref={chatRef} id="chat">
          <div className="max-w-3xl mx-auto">
            {messages.map((m, i) => (
              <div
                key={i}
                className={
                  "my-2 flex " +
                  (m.role === "user" ? "justify-end" : "justify-start")
                }
              >
                <div
                  className={
                    (m.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800 text-gray-100") +
                    " p-3 rounded-lg max-w-[75%]"
                  }
                >
                  <div className="text-sm whitespace-pre-wrap">{m.text}</div>
                  <div className="text-xs text-gray-400 mt-2">
                    {new Date(m.ts).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="my-2 flex justify-start">
                <div className="bg-gray-800 p-3 rounded-lg max-w-[40%] text-sm text-gray-300">
                  IA digitando...
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="max-w-3xl mx-auto w-full">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            rows={3}
            placeholder="Descreva o problema, ex: 'Ar-condicionado modelo X dá erro E1 e apita'"
            className="w-full p-3 rounded bg-gray-800 text-gray-100 resize-none focus:outline-none"
          />
          <div className="flex gap-2 mt-3">
            <button
              onClick={send}
              className="px-4 py-2 bg-green-500 rounded font-semibold hover:brightness-95"
            >
              Enviar
            </button>
            <button
              onClick={() => {
                setMessages([]);
                setLogs([]);
              }}
              className="px-4 py-2 bg-gray-700 rounded"
            >
              Limpar
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
