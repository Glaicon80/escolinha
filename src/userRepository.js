// Repositório: Responsável por acessar o banco de dados
class UserRepository {
  constructor(db) {
    this.db = db;
  }

  // Buscar usuário por usuário e senha
  async findByCredentials(usuario, senha) {
    const [results] = await this.db.query(
      "SELECT * FROM usuarios WHERE usuario = ? AND senha = ?",
      [usuario, senha]
    );
    return results[0]; // Retorna o primeiro usuário encontrado ou undefined
  }

  // Criar novo usuário
  async create(usuario, senha) {
    const [result] = await this.db.query(
      "INSERT INTO usuarios (usuario, senha) VALUES (?, ?)",
      [usuario, senha]
    );
    return result.insertId; // Retorna o ID do novo usuário
  }

  // Verificar se usuário já existe
  async exists(usuario) {
    const [results] = await this.db.query(
      "SELECT id FROM usuarios WHERE usuario = ?",
      [usuario]
    );
    return results.length > 0;
  }
}

module.exports = UserRepository;