const path = require('path');

class AuthController {
  constructor(userService) {
    this.userService = userService;
  }

  showLoginPage(req, res) {
    // Sobe 1 nível: de /app/src para /app, depois vai para views
    const filePath = path.join(__dirname, '../views/login.html');
    console.log(`📁 Servindo página de login: ${filePath}`);
    res.sendFile(filePath);
  }

  showCadastroPage(req, res) {
    const filePath = path.join(__dirname, '../views/cadastro.html');
    console.log(`📁 Servindo página de cadastro: ${filePath}`);
    res.sendFile(filePath);
  }

  showHomePage(req, res) {
    if (!req.session.usuario) {
      return res.redirect("/");
    }
    const filePath = path.join(__dirname, '../views/home.html');
    console.log(`📁 Servindo página home: ${filePath}`);
    res.sendFile(filePath);
  }

  async processLogin(req, res) {
    const { usuario, senha } = req.body;
    
    const result = await this.userService.login(usuario, senha);
    
    if (result.success) {
      req.session.usuario = usuario;
      req.session.userId = result.user.id;
      console.log(`✅ Usuário logado: ${usuario}`);
      res.redirect("/home");
    } else {
      req.session.mensagemErro = result.message;
      res.redirect("/");
    }
  }

  async processCadastro(req, res) {
    const { usuario, senha } = req.body;
    
    const result = await this.userService.cadastro(usuario, senha);
    
    if (result.success) {
      console.log(`✅ Novo usuário cadastrado: ${usuario}`);
      res.redirect("/");
    } else {
      res.send(result.message);
    }
  }

  logout(req, res) {
    req.session.destroy();
    res.redirect("/");
  }

  getMensagem(req, res) {
    const mensagem = req.session.mensagemErro;
    req.session.mensagemErro = null;
    res.json({ mensagem });
  }

  
  healthCheck(req, res) {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
  }
}

module.exports = AuthController;