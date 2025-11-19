# ✅ Setup do PostgreSQL - Concluído!

## 🎉 Status da Configuração

Seu ambiente está configurado e pronto para uso!

---

## 📋 O que foi configurado:

### ✅ PostgreSQL
- **Status:** Instalado e rodando
- **Versão:** PostgreSQL 14
- **Serviço:** Iniciado via Homebrew

### ✅ Banco de Dados
- **Nome:** `motoboy_db`
- **Usuário:** `filipefrancisco`
- **Host:** `localhost`
- **Porta:** `5432`
- **Status:** Criado e configurado

### ✅ Arquivo .env
- **DATABASE_URL:** Configurado
- **NEXTAUTH_SECRET:** Gerado
- **NEXTAUTH_URL:** Configurado
- **NODE_ENV:** development

### ✅ Prisma
- **Client:** Gerado
- **Schema:** Aplicado ao banco
- **Tabelas:** Criadas
- **Seed:** Executado (dados iniciais inseridos)

---

## 🚀 Como Usar

### Iniciar a Aplicação

```bash
npm run dev
```

Acesse: **http://localhost:3000**

### Credenciais de Teste

- **Email:** `admin@motoboy.app`
- **Senha:** `admin123`

⚠️ **IMPORTANTE:** Altere a senha do admin após o primeiro login!

---

## 🛠️ Comandos Úteis

### Gerenciar PostgreSQL

```bash
# Ver status
brew services list | grep postgresql

# Iniciar
brew services start postgresql@14

# Parar
brew services stop postgresql@14

# Reiniciar
brew services restart postgresql@14
```

### Prisma

```bash
# Abrir Prisma Studio (interface visual)
npm run db:studio

# Ver schema
cat prisma/schema.prisma

# Criar nova migration
npm run db:migrate

# Aplicar schema direto (sem migration)
npm run db:push

# Resetar banco (CUIDADO: apaga tudo!)
npm run db:migrate reset
```

### Conectar ao Banco

```bash
# Via psql
/opt/homebrew/opt/postgresql@14/bin/psql -U filipefrancisco -d motoboy_db

# Ou adicione ao PATH (recomendado)
echo 'export PATH="/opt/homebrew/opt/postgresql@14/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# Depois pode usar apenas:
psql -U filipefrancisco -d motoboy_db
```

---

## 📊 Verificar Dados

### Via Prisma Studio (Recomendado)

```bash
npm run db:studio
```

Abre em: **http://localhost:5555**

### Via psql

```bash
psql -U filipefrancisco -d motoboy_db

# Ver tabelas
\dt

# Ver usuários
SELECT email, role, "isActive" FROM users;

# Ver tax rules
SELECT country, "displayName", percentage FROM "TaxRule" WHERE "isActive" = true;

# Sair
\q
```

---

## 🔧 Troubleshooting

### PostgreSQL não inicia

```bash
# Ver logs
brew services list
tail -f ~/Library/Logs/Homebrew/postgresql@14.log

# Tentar iniciar manualmente
/opt/homebrew/opt/postgresql@14/bin/postgres -D /opt/homebrew/var/postgresql@14
```

### Erro de conexão

1. Verifique se PostgreSQL está rodando:
   ```bash
   brew services list | grep postgresql
   ```

2. Verifique a DATABASE_URL no `.env`:
   ```bash
   cat .env | grep DATABASE_URL
   ```

3. Teste conexão:
   ```bash
   psql -U filipefrancisco -d motoboy_db -c "SELECT 1;"
   ```

### Erro "database does not exist"

```bash
# Criar banco manualmente
psql -U filipefrancisco -d postgres -c "CREATE DATABASE motoboy_db;"
```

### Erro "relation does not exist"

```bash
# Aplicar schema novamente
npm run db:push
```

---

## 📝 Estrutura do Banco

### Tabelas Criadas

1. **users** - Usuários do sistema
2. **platforms** - Plataformas de entrega
3. **incomes** - Receitas
4. **expenses** - Despesas
5. **TaxRule** - Regras fiscais por país

### Dados Iniciais

- ✅ 1 usuário admin (`admin@motoboy.app`)
- ✅ 13 tax rules (países: BR, US, CA, GB, DE, FR, ES, IT, PT, AR, MX, CO)

---

## ✅ Checklist Final

- [x] PostgreSQL instalado
- [x] PostgreSQL rodando
- [x] Banco de dados criado
- [x] .env configurado
- [x] Prisma Client gerado
- [x] Schema aplicado
- [x] Seed executado
- [x] Dados iniciais inseridos

---

## 🎯 Próximos Passos

1. **Iniciar aplicação:**
   ```bash
   npm run dev
   ```

2. **Acessar:** http://localhost:3000

3. **Fazer login** com credenciais admin

4. **Explorar:** Criar plataformas, receitas, despesas

5. **Ver dados:** Abrir Prisma Studio (`npm run db:studio`)

---

**Tudo configurado e pronto para uso! 🚀**



