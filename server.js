const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const session = require("express-session");
const path = require("path");

const app = express();

// Configuração do pool de conexões
const pool = mysql.createPool({
  host: process.env.DB_HOST || "db",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "1234",
  database: process.env.DB_NAME || "escolinha",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

const db = pool.promise();

// Função de retry com async/await
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
  console.error("❌ Não foi possível conectar ao MySQL após várias tentativas");
  process.exit(1);
}

// Inicialização
connectWithRetry();

// Middleware para logging (útil para desenvolvimento)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Configurações
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(session({
  secret: process.env.SESSION_SECRET || "segredo",
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: false,
    maxAge: 24 * 60 * 60 * 1000 // 24 horas
  }
}));

// Rotas
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views/login.html"));
});

app.post("/login", async (req, res) => {
  const { usuario, senha } = req.body;

  try {
    const [results] = await db.query(
      "SELECT * FROM usuarios WHERE usuario = ? AND senha = ?",
      [usuario, senha]
    );
    
    if (results.length > 0) {
      req.session.usuario = usuario;
      req.session.userId = results[0].id;
      console.log(`✅ Usuário logado: ${usuario}`);
      res.redirect("/home");
    } else {
      req.session.mensagemErro = "Usuário ou senha incorretos";
      res.redirect("/");
    }
  } catch (err) {
    console.error("Erro no login:", err);
    req.session.mensagemErro = "Erro no servidor";
    res.redirect("/");
  }
});

app.get("/cadastro", (req, res) => {
  res.sendFile(path.join(__dirname, "views/cadastro.html"));
});

app.post("/cadastro", async (req, res) => {
  const { usuario, senha } = req.body;

  if (!usuario || !senha) {
    return res.send("Usuário e senha são obrigatórios");
  }

  try {
    await db.query(
      "INSERT INTO usuarios (usuario, senha) VALUES (?, ?)",
      [usuario, senha]
    );
    console.log(`✅ Novo usuário cadastrado: ${usuario}`);
    res.redirect("/");
  } catch (err) {
    console.error("Erro no cadastro:", err);
    if (err.code === 'ER_DUP_ENTRY') {
      res.send("Usuário já existe!");
    } else {
      res.send("Erro ao cadastrar usuário");
    }
  }
});

app.get("/home", (req, res) => {
  if (!req.session.usuario) {
    return res.redirect("/");
  }
  res.sendFile(path.join(__dirname, "views/home.html"));
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

app.get("/mensagem", (req, res) => {
  const mensagem = req.session.mensagemErro;
  req.session.mensagemErro = null;
  res.json({ mensagem });
});

// Rota de health check para o Docker
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// Tratamento de erros global
app.use((err, req, res, next) => {
  console.error("Erro não tratado:", err);
  res.status(500).send("Erro interno do servidor");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📝 Ambiente: ${process.env.NODE_ENV || 'development'}`);
});