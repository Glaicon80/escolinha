// app.js: Configuração do Express (sem listen)
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const path = require("path");

const { db, connectWithRetry } = require("./database");
const UserRepository = require("./userRepository");
const UserService = require("./userService");
const AuthController = require("./authController");
const createAuthRoutes = require("./authRoutes");

const app = express();

// Inicializa as camadas
const userRepository = new UserRepository(db);
const userService = new UserService(userRepository);
const authController = new AuthController(userService);

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(session({
  secret: process.env.SESSION_SECRET || "segredo",
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: false,
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Rotas
app.use("/", createAuthRoutes(authController)); //vai retornar um router com todas as rotas configuradas (não precisa chamar todas aqui ela ja esta fazendo isso)

// Tratamento de erro global
app.use((err, req, res, next) => {
  console.error("Erro não tratado:", err);
  res.status(500).send("Erro interno do servidor");
});

// Exporta o app para ser usado nos testes
module.exports = app;