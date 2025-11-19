import express from "express";
import fetch from "node-fetch";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(cors());

// Proxy endpoint used by the frontend
// Proxy endpoint used by the frontend
app.post('/api/chat', async (req, res) => {
  try {
    console.log("--- Nova requisição ao Proxy ---");

    // 1. Chama o N8N
    const resp = await fetch('http://localhost:5678/webhook/chat-pipeline', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });

    // 2. O SEGREDO: Ler como TEXTO, nunca como JSON direto
    const rawResponse = await resp.text();
    console.log("Resposta crua do N8N:", rawResponse);

    // 3. Tentar transformar em Objeto
    let finalData;
    try {
        // Se o N8N mandou JSON, isso vai funcionar
        finalData = JSON.parse(rawResponse);
    } catch (e) {
        // Se deu erro (o caso do "Unexpected token O"), é porque é texto puro.
        // Então "embrulhamos" o texto num objeto JSON manualmente.
        console.log("Não é JSON válido, convertendo texto manualmente...");
        finalData = { 
            reply: rawResponse,   // Colocamos em 'reply'
            message: rawResponse  // E em 'message' para garantir
        };
    }

    // 4. Devolvemos JSON válido para o Frontend
    return res.json(finalData);

  } catch (err) {
    console.error('Erro GRAVE no proxy:', err);
    return res.status(500).json({ error: 'proxy_error', message: String(err) });
  }
});

// Serve frontend static files (Vite build output expected in ../frontend/dist)
app.use(express.static(path.join(__dirname, "../frontend/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

const port = process.env.PORT || 3000;
app.listen(port, () =>
  console.log(`Proxy + static server running on http://localhost:${port}`)
);
