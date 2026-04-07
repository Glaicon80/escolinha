// Testes de integração das rotas (usam banco real)
const request = require("supertest");
const app = require("../src/app");
const { db } = require("../src/database");

describe("Testes de Integração - Rotas de Autenticação", () => {
  
  beforeEach(async () => {
    // Limpar tabela de teste antes de cada teste
    await db.query("DELETE FROM usuarios");
    // Inserir usuário de teste
    await db.query(
      "INSERT INTO usuarios (usuario, senha) VALUES (?, ?)",
      ["testeuser", "123456"]
    );
  });

  describe("GET /", () => {
    test("deve retornar a página de login", async () => {
      const response = await request(app) // dentro do request (supertest) vamos chamar nosso servidor express app
        .get("/") // aqui vamos colocar a rota e o metodo
        .expect(200);

      // console.log(response) - no response vai retornar muita coisa
      
      expect(response.text).toContain("Login"); // na rota "get /"" do controller vai ter um res.sendFile(filePath), ou seja vai retornar um html (texto) e nesse texto contem a palavra Login
      expect(response.text).toContain("form"); 
    });
  });

  describe("POST /login", () => {
    test("deve fazer login com credenciais corretas", async () => {
      const response = await request(app)
        .post("/login") // rota
        .type("form") //Define o tipo de conteúdo da requisição - Equivalente a: set('Content-Type', 'application/x-www-form-urlencoded') - formulario html
        .send({ usuario: "testeuser", senha: "123456" }); // send vai representar o objeto enviado do frontend, do formulario, postmain, do corpo da requisição
      
      expect(response.status).toBe(302); // Redirect - redirecionou para uma outra url
      expect(response.headers.location).toBe("/home"); // Onde o servidor redirecionou - essa informação é passada no header - e tbm no controler vai ter res.redirect("/home");
    });

//Em app.js
//app.use(bodyParser.urlencoded({ extended: false }));
//      ↑
//   Espera receber dados no formato de formulário HTML
// por isso .type("form")
// .type("json")  // Content-Type: application/json (se não por nada esse vai ser o padrao)
//.type("text")  // Content-Type: text/plain

    test("não deve fazer login com senha incorreta", async () => {
      const response = await request(app)
        .post("/login")
        .type("form")
        .send({ usuario: "testeuser", senha: "senha_errada" });
      
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe("/");
    });

    test("não deve fazer login com usuário inexistente", async () => {
      const response = await request(app)
        .post("/login")
        .type("form")
        .send({ usuario: "inexistente", senha: "123456" });
      
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe("/");
    });
  });

  describe("POST /cadastro", () => {
    test("deve cadastrar novo usuário", async () => {
      const response = await request(app)
        .post("/cadastro") // URL da rota de cadastro
        .type("form")  // Tipo: formulário HTML
        .send({ usuario: "novouser", senha: "123456" });
      
      expect(response.status).toBe(302); // Redirect para login
      
      // Verificar se foi inserido no banco, no cadastro é necessário essa verificação extra para ter confirmação
      // no post /login não precisava verificar se foi salvo pq o fato de ter dado certo já garante isso
      const [users] = await db.query(
        "SELECT * FROM usuarios WHERE usuario = ?",
        ["novouser"]
      );
      expect(users.length).toBe(1); // Deve ter 1 usuário
      expect(users[0].usuario).toBe("novouser"); // vai ter 1 usuário e a posição no array é zero, O nome está correto
    });

    test("não deve cadastrar usuário com nome curto", async () => {
      const response = await request(app)
        .post("/cadastro")
        .type("form")
        .send({ usuario: "ab", senha: "123456" });
      
      expect(response.text).toContain("Usuário deve ter pelo menos 3 caracteres"); // na rota post /cadastro o controller vai ter um res.send(result.message) q é um texto
    });

    test("não deve cadastrar usuário já existente", async () => {
      const response = await request(app)
        .post("/cadastro")
        .type("form")
        .send({ usuario: "testeuser", senha: "123456" });
      
      expect(response.text).toContain("Usuário já existe");
    });
  });

  describe("GET /home", () => {
    test("deve redirecionar para login se não autenticado", async () => { //aqui a sessão req.session.usuario não existe
      const response = await request(app)
        .get("/home")
        .expect(302); //status redirecionar
      
      expect(response.headers.location).toBe("/"); // no controler da rota get /home vai ter return res.redirect("/");
    });

    test("deve acessar home quando autenticado", async () => {
      
      // Cria um "agente" (cliente que mantém sessão). Um "navegador virtual" que mantém cookies/sessão, pois precisamos manter a sessão do usuario
      const agent = request.agent(app);
      
      // faz login com o agent para ter a sessão req.session.usuario guardada no cookie
      await agent
        .post("/login")
        .type("form")
        .send({ usuario: "testeuser", senha: "123456" });//usuario que já existe no banco
      
      //Acessa página protegida (home) com o mesmo agente, pois vai ter a sessão req.session.usuario guarda no cookie  guardado junto com a requisição
      // sem criar o agent não seria possível essa parte, pois não teria cookie
      const response = await agent
        .get("/home")
        .expect(200); //Retorna status 200 (OK)
      
      expect(response.text).toContain("Home"); //no controller da rota get /home vai ter res.sendFile(filePath) vai ser um HTML, ou seja, um texto que contem a palavra Home
    });
  });

  describe("GET /health", () => {
    test("deve retornar status ok", async () => {
      const response = await request(app)
        .get("/health")
        .expect(200);
      
      expect(response.body.status).toBe("ok"); //na resposta do controller vai ter res.status(200).json({}) com status ok - o json é enviado no corpo (body) da resposta HTTP.
      expect(response.body.timestamp).toBeDefined(); //"O servidor enviou a data/hora atual"
    });
  });
});