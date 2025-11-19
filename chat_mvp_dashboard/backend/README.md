# Chat MVP — HVAC Assist (Dashboard)

Projeto mínimo para demonstrar seu fluxo N8N (`/chat-pipeline`) com:
- Frontend: React + Vite + Tailwind (tema dashboard escuro)
- Backend: Node + Express (proxy, evita CORS e entrega estáticos)

## Como usar (desenvolvimento)

1. Abra um terminal e inicie seu n8n local (assumindo webhook em `http://localhost:5678/webhook/chat-pipeline`).

2. Frontend:
   ```bash
   cd frontend
   npm install
   npx tailwindcss -i ./src/styles.css -o ./src/tailwind-output.css --watch
   # Em outro terminal (ou mesmo), rode:
   npm run dev
   ```
   Ou para build estática:
   ```bash
   cd frontend
   npm install
   npm run build
   ```

3. Backend (proxy + servidor estático):
   ```bash
   cd backend
   npm install
   npm start
   ```
   O servidor vai rodar em `http://localhost:3000`.
   - Em modo desenvolvimento do frontend (vite dev) você pode configurar `proxy` nas opções do Vite se preferir.

## Observações
- O backend encaminha o payload tal como `{ "userId":"test", "message":"..." }` para o webhook do n8n.
- Respostas retornadas pelo n8n devem estar no formato `{ "reply":"texto da IA" }`.
- Se preferir, eu adapto para deploy em produção (Heroku / Render / Railway).
