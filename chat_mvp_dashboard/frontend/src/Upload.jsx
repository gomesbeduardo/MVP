import React, { useState } from "react";

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");

  const sendFile = async () => {
    if (!file) return setStatus("Nenhum arquivo selecionado");

    const form = new FormData();
    form.append("file", file);
    setStatus("Enviando arquivo...");

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: form,
      });

      const text = await res.text();
      setStatus("📁 Arquivo enviado: " + text);
    } catch (e) {
      setStatus("Erro ao enviar arquivo");
    }
  };

  return (
    <div className="min-h-screen bg-[#111b21] text-gray-100 flex flex-col items-center p-8">

      {/* TOPO COM BOTÃO DE VOLTAR */}
      <div className="w-full max-w-3xl flex justify-between items-center mb-10">
        <h1 className="text-xl font-semibold text-green-400">
          Envio de Arquivos
        </h1>

        <button
          className="px-4 py-2 bg-[#005c4b] rounded-lg hover:brightness-110 text-sm"
          onClick={() => (window.location.href = "/")}
        >
          Voltar ao chat
        </button>
      </div>

      <div className="bg-[#202c33] p-6 rounded-xl shadow max-w-md w-full text-center">
        <input
          type="file"
          className="text-sm text-gray-300 mb-3"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button
          onClick={sendFile}
          className="px-4 py-2 rounded-lg bg-[#005c4b] w-full hover:brightness-110"
        >
          Enviar arquivo
        </button>

        <p className="mt-4 text-gray-200 text-sm whitespace-pre-wrap">
          {status}
        </p>
      </div>
    </div>
  );
}
