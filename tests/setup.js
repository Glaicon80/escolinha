// Setup dos testes - roda antes de todos os testes
const { db } = require("../src/database");

// roda antes de todos os testes uma vez
beforeAll(async () => {
  try {
    // Aguarda o banco ficar pronto
    let retries = 10;
    while (retries) {
      try {
        await db.query("SELECT 1"); // SELECT 1 é um comando sql válido só para testar a conexão, se o banco responde, o retorno é 1. não utiliza tabela
        console.log("✅ Banco de dados conectado!");
        break;
      } catch (err) {
        console.log(`⏳ Aguardando banco... (${retries} tentativas restantes)`);
        retries--;
        if (retries === 0) throw err;
        await new Promise(res => setTimeout(res, 3000));
      }
    }
    
    // Criar tabela de teste se não existir
    await db.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        usuario VARCHAR(100) NOT NULL UNIQUE,
        senha VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log("✅ Setup dos testes concluído!");
  } catch (err) {
    console.error("❌ Erro no setup dos testes:", err.message);
    throw err;
  }
});


afterAll(async () => {
  // Fechar conexão após os testes
  await db.end();
});