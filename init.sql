-- Criação do banco de dados
CREATE DATABASE IF NOT EXISTS escolinha;
USE escolinha; -- banco criado automaticamente na execução do docker-compose.yml

-- Tabela de usuários para desenvolvimento
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(50) NOT NULL UNIQUE,
    senha VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Inserir usuário admin
INSERT INTO usuarios (usuario, senha) 
VALUES ('admin', '1234') 
ON DUPLICATE KEY UPDATE usuario = usuario;

SELECT '✅ Banco de dados inicializado com sucesso!' as status;