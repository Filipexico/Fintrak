# ⚡ Comandos Rápidos - PostgreSQL

## 🚀 Iniciar Aplicação

```bash
npm run dev
```

Acesse: **http://localhost:3000**

---

## 🗄️ Gerenciar PostgreSQL

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

---

## 📊 Prisma Studio (Interface Visual)

```bash
npm run db:studio
```

Abre em: **http://localhost:5555**

---

## 🔧 Prisma

```bash
# Gerar Prisma Client
npm run db:generate

# Aplicar schema (sem migration)
npm run db:push

# Criar migration
npm run db:migrate

# Executar seed
npm run db:seed
```

---

## 💾 Conectar ao Banco

```bash
# Adicionar PostgreSQL ao PATH (uma vez)
echo 'export PATH="/opt/homebrew/opt/postgresql@14/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# Conectar
psql -U filipefrancisco -d motoboy_db

# Comandos úteis dentro do psql:
\dt          # Listar tabelas
\du          # Listar usuários
\d users     # Ver estrutura da tabela users
\q           # Sair
```

---

## ✅ Verificar Dados

```bash
# Ver usuários
psql -U filipefrancisco -d motoboy_db -c "SELECT email, role FROM users;"

# Ver tax rules
psql -U filipefrancisco -d motoboy_db -c "SELECT country, \"displayName\", percentage FROM \"TaxRule\" WHERE \"isActive\" = true;"

# Contar registros
psql -U filipefrancisco -d motoboy_db -c "SELECT COUNT(*) FROM users; SELECT COUNT(*) FROM platforms; SELECT COUNT(*) FROM incomes; SELECT COUNT(*) FROM expenses;"
```

---

## 🔑 Credenciais de Teste

- **Email:** `admin@motoboy.app`
- **Senha:** `admin123`

---

**Tudo pronto para usar! 🎉**



