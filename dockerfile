FROM node:18-alpine

# Instala ferramentas úteis
RUN apk add --no-cache bash curl

# Cria diretório da aplicação
WORKDIR /app

# Copia apenas os arquivos de dependências (melhor cache)
COPY package*.json ./

# Instala dependências incluindo devDependencies (nodemon)
RUN npm install

# Instala nodemon globalmente (opcional)
RUN npm install -g nodemon

# Expõe a porta da aplicação
EXPOSE 3000

# Comando padrão para desenvolvimento
CMD ["npm", "run", "dev"]