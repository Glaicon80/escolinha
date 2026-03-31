Acesse a aplicação:

## Frontend: http://localhost:3000

## Banco de dados: localhost:3306

## PHPMyadmin http://localhost:8081

# 🏫 Sistema Escolinha

Sistema de gestão escolar com autenticação de usuários, desenvolvido com Node.js, Express e MySQL, totalmente containerizado com Docker.

## 📋 Pré-requisitos

- [Docker](https://docs.docker.com/get-docker/) (versão 20.10+)
- [Docker Compose](https://docs.docker.com/compose/install/) (versão 1.29+)
- Git (opcional, para clonar)

## 🚀 Como executar

### Método 1: Clonando o repositório

```bash
# Clone o projeto
git clone https://github.com/Glaicon80/escolinha.git
cd escolinha

# Execute os containers
docker-compose up --build

# Iniciar os containers em background
docker-compose up -d

# Ver logs em tempo real
docker-compose logs -f

# Parar os containers
docker-compose down

# Parar e remover volumes (apaga os dados do banco)
docker-compose down -v

# Reconstruir os containers
docker-compose up --build

# Acessar o container da aplicação
docker exec -it app sh

# Acessar o MySQL
docker exec -it db mysql -p
# Senha: 1234

# Executar comandos no MySQL
docker exec -it db mysql -p -e "SHOW DATABASES;"