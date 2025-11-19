# ⚡ Setup Rápido - PostgreSQL no Mac

## 🚀 Opção 1: Script Automático (Recomendado)

```bash
# Execute o script de setup
./setup-db.sh
```

O script vai:
- ✅ Verificar/instalar PostgreSQL
- ✅ Criar banco de dados
- ✅ Configurar .env
- ✅ Executar migrations
- ✅ Executar seed

---

## 🛠️ Opção 2: Manual (Passo a Passo)

### 1. Instalar PostgreSQL

```bash
# Instalar via Homebrew
brew install postgresql@14

# Iniciar PostgreSQL
brew services start postgresql@14
```

### 2. Criar Banco de Dados

```bash
# Obter seu usuário do Mac
whoami

# Conectar ao PostgreSQL (substitua 'seu_usuario' pelo resultado acima)
psql postgres

# Dentro do psql, execute:
CREATE DATABASE motoboy_db;
\q
```

### 3. Configurar .env

Edite o arquivo `.env` na raiz do projeto:

```env
# Substitua 'seu_usuario' pelo seu usuário do Mac (resultado do comando 'whoami')
DATABASE_URL="postgresql://seu_usuario@localhost:5432/motoboy_db?schema=public"

NEXTAUTH_URL="http://localhost:3000"

# Gere uma chave secreta:
NEXTAUTH_SECRET="cole_aqui_a_chave_gerada"

NODE_ENV="development"
```

**Gerar NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 4. Executar Setup do Prisma

```bash
# Gerar Prisma Client
npm run db:generate

# Criar tabelas (escolha uma opção):
npm run db:migrate    # Com histórico de migrations
# OU
npm run db:push       # Aplicar schema direto

# Popular banco com dados iniciais
npm run db:seed
```

### 5. Verificar

```bash
# Abrir Prisma Studio (interface visual)
npm run db:studio

# Iniciar aplicação
npm run dev
```

---

## 🔍 Verificar se Está Funcionando

### Teste 1: Conexão com Banco

```bash
# Conectar ao banco
psql -d motoboy_db

# Ver tabelas
\dt

# Sair
\q
```

### Teste 2: Prisma Studio

```bash
npm run db:studio
```

Deve abrir em `http://localhost:5555` mostrando todas as tabelas.

### Teste 3: Aplicação

```bash
npm run dev
```

Acesse `http://localhost:3000` e faça login com:
- **Email:** `admin@motoboy.app`
- **Senha:** `admin123`

---

## ❌ Problemas Comuns

### "psql: command not found"

**Solução:**
```bash
# Adicionar ao PATH
echo 'export PATH="/opt/homebrew/opt/postgresql@14/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### "password authentication failed"

**Solução:** Use o usuário do seu Mac sem senha:
```env
DATABASE_URL="postgresql://seu_usuario@localhost:5432/motoboy_db?schema=public"
```

### "database does not exist"

**Solução:**
```bash
psql postgres
CREATE DATABASE motoboy_db;
\q
```

### "connection refused"

**Solução:**
```bash
# Verificar se PostgreSQL está rodando
brew services list | grep postgresql

# Se não estiver, iniciar:
brew services start postgresql@14
```

---

## 📝 Comandos Úteis

```bash
# Ver status do PostgreSQL
brew services list | grep postgresql

# Iniciar PostgreSQL
brew services start postgresql@14

# Parar PostgreSQL
brew services stop postgresql@14

# Reiniciar PostgreSQL
brew services restart postgresql@14

# Conectar ao banco
psql -d motoboy_db

# Ver todas as tabelas
psql -d motoboy_db -c "\dt"

# Resetar banco (CUIDADO: apaga tudo!)
npm run db:migrate reset
```

---

## ✅ Checklist

- [ ] PostgreSQL instalado (`brew install postgresql@14`)
- [ ] PostgreSQL rodando (`brew services start postgresql@14`)
- [ ] Banco criado (`CREATE DATABASE motoboy_db;`)
- [ ] `.env` configurado com `DATABASE_URL` correta
- [ ] `NEXTAUTH_SECRET` gerado e configurado
- [ ] Prisma Client gerado (`npm run db:generate`)
- [ ] Migrations executadas (`npm run db:migrate`)
- [ ] Seed executado (`npm run db:seed`)
- [ ] Prisma Studio funciona (`npm run db:studio`)
- [ ] Aplicação inicia (`npm run dev`)

---

**Pronto! Seu ambiente está configurado.** 🎉
