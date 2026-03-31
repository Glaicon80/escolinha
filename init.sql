-- Criação do banco de dados (já criado pelo MYSQL_DATABASE)
USE escolinha;

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_usuario (usuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de logs (opcional)
CREATE TABLE IF NOT EXISTS logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    acao VARCHAR(255),
    data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
    INDEX idx_data_hora (data_hora)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inserir usuário admin (se não existir)
INSERT INTO usuarios (usuario, senha) 
VALUES ('admin', '1234') 
ON DUPLICATE KEY UPDATE usuario = usuario;

-- Inserir usuário de teste
INSERT INTO usuarios (usuario, senha) 
VALUES ('teste', '1234') 
ON DUPLICATE KEY UPDATE usuario = usuario;

-- Mensagem de confirmação
SELECT '✅ Banco de dados inicializado com sucesso!' as status;