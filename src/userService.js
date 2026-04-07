// Service: Responsável pelas regras de negócio
class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  // Validar e fazer login
  async login(usuario, senha) {
    // Validação básica
    if (!usuario || !senha) {
      return { success: false, message: "Usuário e senha são obrigatórios" };
    }

    // Buscar usuário no banco
    const user = await this.userRepository.findByCredentials(usuario, senha);
    
    if (user) {
      return { 
        success: true, 
        message: "Login realizado com sucesso",
        user: { id: user.id, usuario: user.usuario }
      };
    } else {
      return { success: false, message: "Usuário ou senha incorretos" };
    }
  }

  // Validar e cadastrar usuário
  async cadastro(usuario, senha) {
    // Validações
    if (!usuario || !senha) {
      return { success: false, message: "Usuário e senha são obrigatórios" };
    }

    if (usuario.length < 3) {
      return { success: false, message: "Usuário deve ter pelo menos 3 caracteres" };
    }

    if (senha.length < 3) {
      return { success: false, message: "Senha deve ter pelo menos 3 caracteres" };
    }

    // Verificar se usuário já existe
    const exists = await this.userRepository.exists(usuario);
    if (exists) {
      return { success: false, message: "Usuário já existe" };
    }

    // Criar usuário
    const userId = await this.userRepository.create(usuario, senha);
    
    return { 
      success: true, 
      message: "Usuário cadastrado com sucesso",
      userId: userId
    };
  }
}

module.exports = UserService;