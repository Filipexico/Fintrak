# 📊 Prisma Database Setup

## Schema

O schema Prisma define 5 modelos principais:

1. **User** - Usuários do sistema (USER ou ADMIN)
2. **Platform** - Plataformas de entrega (Uber Eats, iFood, etc.)
3. **Income** - Registros de receita
4. **Expense** - Registros de despesas
5. **TaxRule** - Regras fiscais por país

## Setup do Banco de Dados

### 1. Configure o arquivo `.env`

Copie o `.env.example` para `.env` e configure a `DATABASE_URL`:

```bash
cp .env.example .env
```

Edite o `.env` com sua conexão PostgreSQL:
```
DATABASE_URL="postgresql://usuario:senha@localhost:5432/motoboy_db?schema=public"
```

### 2. Crie o banco de dados

```bash
# No PostgreSQL
createdb motoboy_db
```

### 3. Execute as migrations

```bash
npm run db:migrate
```

Isso criará todas as tabelas no banco de dados.

### 4. Execute o seed (dados iniciais)

```bash
npm run db:seed
```

O seed criará:
- ✅ Usuário admin padrão
- ✅ Tax rules para 13 países

**Credenciais do Admin:**
- Email: `admin@motoboy.app`
- Senha: `admin123`

⚠️ **IMPORTANTE**: Altere a senha após o primeiro login!

## Comandos Úteis

```bash
# Gerar Prisma Client (após mudanças no schema)
npm run db:generate

# Criar nova migration
npm run db:migrate

# Abrir Prisma Studio (interface visual do banco)
npm run db:studio

# Aplicar schema sem migration (apenas desenvolvimento)
npm run db:push
```

## Estrutura das Tabelas

### Users
- Isolamento multi-tenant: cada usuário vê apenas seus dados
- Role: USER ou ADMIN
- Campos de localização: country, currency

### Platforms
- Relacionamento 1:N com User
- Soft delete via `isActive`

### Incomes
- Relacionamento com User e Platform (opcional)
- Suporte multi-moeda
- Indexado por data para queries rápidas

### Expenses
- Categorização via enum (fuel, insurance, phone, etc.)
- Relacionamento apenas com User
- Indexado por data e categoria

### TaxRules
- Tabela global (não por usuário)
- Apenas admins podem gerenciar
- Usado para cálculos de imposto estimado




