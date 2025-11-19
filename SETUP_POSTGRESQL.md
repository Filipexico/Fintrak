# 🐘 Guia de Instalação e Configuração do PostgreSQL no Mac

## 📋 Passo 1: Instalar PostgreSQL

### Opção 1: Homebrew (Recomendado)

```bash
# Instalar Homebrew (se não tiver)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Instalar PostgreSQL
brew install postgresql@14

# Iniciar PostgreSQL
brew services start postgresql@14
```

### Opção 2: Postgres.app (Interface Gráfica)

1. Baixe em: https://postgresapp.com/
2. Instale e abra o app
3. Clique em "Initialize" para criar um servidor local

### Opção 3: Docker (Alternativa)

```bash
# Instalar Docker Desktop (se não tiver)
# Baixe em: https://www.docker.com/products/docker-desktop

# Rodar PostgreSQL em container
docker run --name motoboy-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=motoboy_db \
  -p 5432:5432 \
  -d postgres:14
```

---

## 📋 Passo 2: Verificar Instalação

```bash
# Verificar se PostgreSQL está rodando
psql --version

# Ou verificar via Homebrew
brew services list | grep postgresql
```

---

## 📋 Passo 3: Criar Banco de Dados

### Se instalou via Homebrew:

```bash
# Conectar ao PostgreSQL (usuário padrão: seu usuário do Mac)
psql postgres

# Dentro do psql, execute:
CREATE DATABASE motoboy_db;
CREATE USER motoboy_user WITH PASSWORD 'sua_senha_segura';
GRANT ALL PRIVILEGES ON DATABASE motoboy_db TO motoboy_user;
\q
```

### Se instalou via Postgres.app:

1. Abra o Postgres.app
2. Clique em "New Database"
3. Nome: `motoboy_db`
4. Anote o usuário (geralmente seu usuário do Mac)

### Se instalou via Docker:

O banco já está criado! Use:
- **Usuário:** `postgres`
- **Senha:** `postgres`
- **Database:** `motoboy_db`
- **Host:** `localhost`
- **Porta:** `5432`

---

## 📋 Passo 4: Configurar .env

Edite o arquivo `.env` na raiz do projeto:

```env
# Database
DATABASE_URL="postgresql://usuario:senha@localhost:5432/motoboy_db?schema=public"

# Exemplo com Homebrew (usuário padrão):
DATABASE_URL="postgresql://seu_usuario_mac@localhost:5432/motoboy_db?schema=public"

# Exemplo com Docker:
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/motoboy_db?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="sua-chave-secreta-aqui"

# App
NODE_ENV="development"
```

**Importante:** Substitua:
- `usuario` pelo seu usuário do Mac (ou `postgres` se usar Docker)
- `senha` pela senha que você definiu (ou `postgres` se usar Docker)
- `sua-chave-secreta-aqui` por uma chave gerada (veja abaixo)

---

## 📋 Passo 5: Gerar NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

Copie o resultado e cole no `.env` como `NEXTAUTH_SECRET`.

---

## 📋 Passo 6: Executar Migrations

```bash
# Gerar Prisma Client
npm run db:generate

# Executar migrations (cria as tabelas)
npm run db:migrate

# Ou se preferir aplicar schema sem migration:
npm run db:push
```

---

## 📋 Passo 7: Executar Seed (Dados Iniciais)

```bash
npm run db:seed
```

Isso criará:
- ✅ Usuário admin padrão (email: `admin@motoboy.app`, senha: `admin123`)
- ✅ Tax rules para 13 países

---

## 📋 Passo 8: Verificar Conexão

```bash
# Abrir Prisma Studio (interface visual do banco)
npm run db:studio
```

Isso abrirá uma interface web em `http://localhost:5555` onde você pode ver todas as tabelas e dados.

---

## 🔧 Troubleshooting

### Erro: "psql: command not found"

**Solução:** Adicione PostgreSQL ao PATH:

```bash
# Para Homebrew
echo 'export PATH="/opt/homebrew/opt/postgresql@14/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### Erro: "password authentication failed"

**Solução:** Verifique o usuário e senha no `.env`. Se usar Homebrew, pode não precisar de senha:

```env
DATABASE_URL="postgresql://seu_usuario@localhost:5432/motoboy_db?schema=public"
```

### Erro: "database does not exist"

**Solução:** Crie o banco manualmente:

```bash
psql postgres
CREATE DATABASE motoboy_db;
\q
```

### Erro: "connection refused"

**Solução:** Verifique se PostgreSQL está rodando:

```bash
# Homebrew
brew services start postgresql@14

# Docker
docker start motoboy-postgres

# Verificar
psql -h localhost -p 5432 -U postgres -d postgres
```

---

## ✅ Checklist Final

- [ ] PostgreSQL instalado e rodando
- [ ] Banco de dados `motoboy_db` criado
- [ ] Arquivo `.env` configurado com `DATABASE_URL` correta
- [ ] `NEXTAUTH_SECRET` gerado e configurado
- [ ] Migrations executadas (`npm run db:migrate`)
- [ ] Seed executado (`npm run db:seed`)
- [ ] Prisma Studio abre sem erros (`npm run db:studio`)
- [ ] Aplicação inicia sem erros (`npm run dev`)

---

## 🚀 Comandos Rápidos

```bash
# Iniciar PostgreSQL (Homebrew)
brew services start postgresql@14

# Parar PostgreSQL
brew services stop postgresql@14

# Conectar ao banco
psql -d motoboy_db

# Ver tabelas
psql -d motoboy_db -c "\dt"

# Ver usuários
psql -d motoboy_db -c "\du"

# Resetar banco (CUIDADO: apaga tudo!)
npm run db:migrate reset
```

---

**Pronto! Seu banco de dados está configurado e pronto para uso.** 🎉




