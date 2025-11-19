# 🐘 Guia de Instalação e Configuração do PostgreSQL

## 📋 Passo a Passo para Mac

### 1. Instalar PostgreSQL

#### Opção A: Homebrew (Recomendado)

```bash
# Instalar Homebrew (se não tiver)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Instalar PostgreSQL
brew install postgresql@14

# Iniciar PostgreSQL
brew services start postgresql@14
```

#### Opção B: Postgres.app (Interface Gráfica)

1. Baixe em: https://postgresapp.com/
2. Instale e abra o app
3. Clique em "Initialize" para criar um servidor

### 2. Verificar Instalação

```bash
# Verificar se está rodando
brew services list | grep postgresql

# Ou testar conexão
psql postgres
```

### 3. Criar Banco de Dados

```bash
# Conectar ao PostgreSQL
psql postgres

# Criar banco de dados
CREATE DATABASE motoboy_db;

# Criar usuário (opcional, pode usar seu usuário do Mac)
CREATE USER motoboy_user WITH PASSWORD 'sua_senha_aqui';

# Dar permissões
GRANT ALL PRIVILEGES ON DATABASE motoboy_db TO motoboy_user;

# Sair
\q
```

### 4. Configurar .env

Edite o arquivo `.env` com:

```env
DATABASE_URL="postgresql://filipefrancisco@localhost:5432/motoboy_db?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="sua-chave-secreta-aqui"
NODE_ENV="development"
```

**Nota:** Se criou um usuário específico, use:
```env
DATABASE_URL="postgresql://motoboy_user:sua_senha_aqui@localhost:5432/motoboy_db?schema=public"
```

### 5. Executar Migrations

```bash
npm run db:migrate
```

### 6. Executar Seed

```bash
npm run db:seed
```

### 7. Testar

```bash
npm run dev
```

---

## 🔧 Troubleshooting

### PostgreSQL não inicia

```bash
# Reiniciar serviço
brew services restart postgresql@14

# Ver logs
brew services info postgresql@14
```

### Erro de conexão

Verifique:
1. PostgreSQL está rodando: `brew services list`
2. Porta correta (padrão: 5432)
3. Nome do banco está correto
4. Usuário tem permissões

### Resetar banco (se necessário)

```bash
# CUIDADO: Isso apaga todos os dados!
psql postgres -c "DROP DATABASE IF EXISTS motoboy_db;"
psql postgres -c "CREATE DATABASE motoboy_db;"
npm run db:migrate
npm run db:seed
```

