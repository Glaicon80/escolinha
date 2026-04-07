const mysql = require("mysql2");

// Configuração do pool de conexões
const pool = mysql.createPool({
  host: process.env.DB_HOST || "db",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "1234",
  database: process.env.DB_NAME || "escolinha",
  waitForConnections: true, //espere por conexões
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true, //Manter Ativo
  keepAliveInitialDelay: 0 //Manter ativo Atraso inicial
});

const db = pool.promise();

// Função para testar conexão
async function connectWithRetry() {
  let retries = 10;
  while (retries) {
    try {
      const connection = await db.getConnection();
      console.log("✅ Conectado ao MySQL");
      connection.release();
      return true;
    } catch (err) {
      console.log(`⏳ Banco não pronto, tentando novamente em 5s... (${retries} tentativas restantes)`);
      retries--;
      await new Promise(res => setTimeout(res, 5000));
    }
  }
  console.error("❌ Não foi possível conectar ao MySQL");
  process.exit(1);
}

module.exports = { db, connectWithRetry };