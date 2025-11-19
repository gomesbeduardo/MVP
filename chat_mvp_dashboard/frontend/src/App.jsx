import React, { useState, useRef, useEffect } from "react";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const send = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input, ts: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
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
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "Erro ao conectar ao servidor",
          ts: Date.now(),
        },
      ]);
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
    <div className="min-h-screen bg-[#111b21] text-gray-100 flex flex-col">

      {/* BOTÃO DE TROCA DE PÁGINA (NOVO) */}
      <div className="p-3 bg-[#202c33] flex justify-between items-center">
        <h1 className="text-lg font-semibold text-green-400">ChatBot CentralEng</h1>
        <button
          className="px-4 py-2 bg-[#005c4b] rounded-lg hover:brightness-110 text-sm"
          onClick={() => (window.location.href = "/upload")}
        >
          Ir para envio de arquivos
        </button>
      </div>

      {/* CHAT CENTRALIZADO */}
      <main className="flex-1 flex flex-col items-center px-4">
        <div
          ref={chatRef}
          className="w-full max-w-3xl flex-1 overflow-y-auto pt-10 pb-6 px-2 space-y-4"
        >
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-3 max-w-[70%] whitespace-pre-wrap rounded-xl shadow 
                  ${
                    m.role === "user"
                      ? "bg-[#005c4b] text-white"
                      : "bg-[#202c33] text-gray-100"
                  }
                `}
              >
                {m.text}
                <div className="text-xs text-gray-300 mt-1">
                  {new Date(m.ts).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-[#202c33] px-3 py-2 rounded-xl text-gray-300 text-sm">
                Digitando...
              </div>
            </div>
          )}
        </div>

        {/* INPUT CENTRALIZADO ESTILO GPT */}
        <div className="w-full max-w-3xl mt-2 mb-6 flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            rows={2}
            placeholder="Digite sua mensagem..."
            className="flex-1 p-4 rounded-lg bg-[#202c33] text-gray-100 resize-none focus:outline-none"
          />
          <button
            onClick={send}
            className="px-4 py-2 bg-[#005c4b] rounded-lg font-semibold hover:brightness-110"
          >
            Enviar
          </button>
        </div>
      </main>
    </div>
  );
}
