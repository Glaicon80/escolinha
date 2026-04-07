// server.js: Apenas inicia o servidor
const app = require("./app");
const { connectWithRetry } = require("./database");

const PORT = 3000;

// Inicializa conexão com banco e depois (then) então inicia servidor
connectWithRetry().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`📝 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  });
});