// Testes unitários do Service (não acessam banco real - usamos mock)
const UserService = require("../src/userService");

// Mock do repositório - criando um objeto mock
//jest.fn() Cria uma função falsa que você pode controlar
// jest não precisa ser importado nem requerido require('jest') ou import { jest } from 'jest', pois ele é global qdo vc faz o comando npm test
const mockUserRepository = {
  findByCredentials: jest.fn(),
  create: jest.fn(),
  exists: jest.fn()
};

// o jest traz com ele metodos globais tbm
// Globals do Jest (não precisam de import)
//describe('meu teste', () => {});     // Agrupa testes
//test('deve funcionar', () => {});    // Define um teste
//it('deve funcionar', () => {});      // Alias do test
//expect(valor).toBe(10);              // Faz asserções
//beforeEach(() => {});                // Roda antes de cada teste
//afterEach(() => {});                 // Roda depois de cada teste
//beforeAll(() => {});                 // Roda uma vez antes
//afterAll(() => {});                  // Roda uma vez depois

//jest.spyOn(obj, 'method');     // Espiona uma função
//jest.mock('./modulo');          // Mocka um módulo inteiro
//jest.useFakeTimers();           // Usa timers falsos
//jest.resetAllMocks();           // Reseta todos os mocks
//jest.restoreAllMocks();         // Restaura mocks originais

describe("UserService - Testes Unitários", () => {
  let userService;

  beforeEach(() => {
    // Limpar os mocks antes de cada teste
    jest.clearAllMocks();
    // Criar service com o mock injetado
    userService = new UserService(mockUserRepository);
  });

  describe("login", () => {
    test("deve retornar erro quando usuário não informado", async () => {
      const result = await userService.login("", "1234");
      
      expect(result.success).toBe(false);
      expect(result.message).toBe("Usuário e senha são obrigatórios");
      //Você pode verificar se não foi chamada 
      //toHaveBeenCalled() = Verifica se a função falsa foi chamada jest.fn() (findByCredentials, create, exists ) //como não passou pela validação nem chegou a ser chamada
      expect(mockUserRepository.findByCredentials).not.toHaveBeenCalled();
    });

    test("deve retornar erro quando senha não informada", async () => {
      const result = await userService.login("admin", "");
      
      expect(result.success).toBe(false);
      expect(result.message).toBe("Usuário e senha são obrigatórios");
    });

    test("deve retornar sucesso quando credenciais corretas", async () => {
      // Configurar o mock para retornar um usuário
      //mockResolvedValue() = Define o que a função falsa vai retornar
      mockUserRepository.findByCredentials.mockResolvedValue({
        id: 1,
        usuario: "admin",
        senha: "1234"
      });

      //EXECUTAR o código que usa o mock
      const result = await userService.login("admin", "1234");
      
      //VERIFICAR se o mock foi usado corretamente
      expect(result.success).toBe(true);
      expect(result.message).toBe("Login realizado com sucesso");
      //toBeDefined verifica se um valor existe e não é undefined
      expect(result.user).toBeDefined();
      expect(result.user.usuario).toBe("admin");
      // Verificar se foi chamado o repositorio falso e com argumentos específicos
      expect(mockUserRepository.findByCredentials).toHaveBeenCalledWith("admin", "1234");
    });

    test("deve retornar erro quando credenciais incorretas", async () => {
      // Configurar o mock para retornar undefined (usuário não encontrado)
      mockUserRepository.findByCredentials.mockResolvedValue(undefined);

      const result = await userService.login("admin", "senha_errada");
      
      expect(result.success).toBe(false);
      expect(result.message).toBe("Usuário ou senha incorretos");
    });
  });

  describe("cadastro", () => {
    test("deve retornar erro quando usuário não informado", async () => {
      const result = await userService.cadastro("", "1234");
      
      expect(result.success).toBe(false);
      expect(result.message).toBe("Usuário e senha são obrigatórios");
    });

    test("deve retornar erro quando usuário tem menos de 3 caracteres", async () => {
      const result = await userService.cadastro("ab", "1234");
      
      expect(result.success).toBe(false);
      expect(result.message).toBe("Usuário deve ter pelo menos 3 caracteres");
    });

    test("deve retornar erro quando senha tem menos de 3 caracteres", async () => {
      const result = await userService.cadastro("admin", "12");
      
      expect(result.success).toBe(false);
      expect(result.message).toBe("Senha deve ter pelo menos 3 caracteres");
    });

    test("deve retornar erro quando usuário já existe", async () => {
      // Configurar mock para indicar que usuário existe
      mockUserRepository.exists.mockResolvedValue(true);

      const result = await userService.cadastro("admin", "1234");
      
      expect(result.success).toBe(false);
      expect(result.message).toBe("Usuário já existe");
      // a função false create não foi chamada pq o usuário já existe
      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });

    test("deve cadastrar com sucesso quando dados válidos", async () => {
      // Configurar mocks
      //vai retornar que usuario não existe
      mockUserRepository.exists.mockResolvedValue(false);
        //vai criar o usuario e retornar o id = 5
        mockUserRepository.create.mockResolvedValue(5);

      const result = await userService.cadastro("novouser", "123456");
      
      expect(result.success).toBe(true);
      expect(result.message).toBe("Usuário cadastrado com sucesso");
      expect(result.userId).toBe(5);
      expect(mockUserRepository.create).toHaveBeenCalledWith("novouser", "123456");
    });
  });
});

/** 

Visualização do fluxo:

TESTE (MOCK)
│
├── Configura o mock
│   mockUserRepository.create.mockResolvedValue(5)
│   (prepara a função falsa para retornar 5)
│
├── Executa o service
│   userService.cadastro("novouser", "123456")
│   │
│   └── DENTRO DO SERVICE:
│       const userId = await this.userRepository.create("novouser", "123456")
│       │             ↑
│       │             Chama a função falsa
│       │
│       └── A função falsa RETORNA 5 (configurado acima)
│
│       return { success: true, userId: 5 }
│
└── Verifica o resultado
    expect(result.userId).toBe(5) ✅
    */