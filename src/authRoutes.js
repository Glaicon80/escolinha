// Routes: Responsável por definir as rotas
const express = require("express");
const router = express.Router();

module.exports = (authController) => {
  // Rotas públicas
  router.get("/", (req, res) => authController.showLoginPage(req, res));
  router.post("/login", (req, res) => authController.processLogin(req, res));
  router.get("/cadastro", (req, res) => authController.showCadastroPage(req, res));
  router.post("/cadastro", (req, res) => authController.processCadastro(req, res));
  
  // Rotas protegidas
  router.get("/home", (req, res) => authController.showHomePage(req, res));
  router.get("/logout", (req, res) => authController.logout(req, res));
  
  // Utilitários
  //aqui vai passar todas as mensagens guardadas na sessão mensagem e que é apagada logo em seguida
  // vai ser a pagina de login com o fetch('/mensagem') que vai fazer essa requisição toda vez que atualizar a pagina
  router.get("/mensagem", (req, res) => authController.getMensagem(req, res));
  //uma rota de health check (verificação de saúde da aplicação) aplicação está viva e funcionando
  router.get("/health", (req, res) => authController.healthCheck(req, res));
  
  return router;
};