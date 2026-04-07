FROM node:18-alpine

# Instala ferramentas úteis
RUN apk add --no-cache curl

# Cria diretório da aplicação
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências
RUN npm install

# Instala nodemon globalmente para desenvolvimento
RUN npm install -g nodemon

# Copia o resto dos arquivos
COPY . .

# Expõe a porta
EXPOSE 3000

# Comando para iniciar a aplicação com nodemon  - npm run dev - ai vai no scripts do package.json "dev": "nodemon src/server.js"
CMD ["npm", "run", "dev"]  