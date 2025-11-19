# 🚴 Sistema de Controle Financeiro para Entregadores

Aplicação web multi-tenant completa para controle financeiro de entregadores (couriers) com isolamento completo de dados por usuário e painel administrativo robusto.

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Uso](#-uso)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [API Documentation](#-api-documentation)
- [Deploy](#-deploy)
- [Credenciais de Teste](#-credenciais-de-teste)
- [Segurança](#-segurança)

## 🎯 Sobre o Projeto

Sistema completo de controle financeiro desenvolvido para entregadores que trabalham com múltiplas plataformas (Uber Eats, iFood, 99Food, etc.). Permite registrar receitas, despesas, visualizar relatórios financeiros e estimar impostos baseados no país do usuário.

### Características Principais

- ✅ **Multi-tenant**: Isolamento completo de dados por usuário
- ✅ **Seguro**: Autenticação robusta, validações em múltiplas camadas
- ✅ **Completo**: CRUD completo para todas as entidades
- ✅ **Analítico**: Dashboard com gráficos e KPIs
- ✅ **Administrativo**: Painel admin com gestão completa
- ✅ **Responsivo**: Interface adaptável para mobile e desktop

## ✨ Funcionalidades

### Para Usuários

- 🔐 **Autenticação**: Registro, login e gerenciamento de sessão
- 📊 **Dashboard**: Visão geral financeira com KPIs e gráficos
- 💰 **Receitas**: Registro de receitas por plataforma
- 💸 **Despesas**: Registro de despesas por categoria
- 📦 **Plataformas**: Gerenciamento de plataformas de entrega
- 📈 **Relatórios**: Análises detalhadas com filtros por período
- 💵 **Impostos**: Cálculo automático de impostos estimados
- 🌍 **Multi-moeda**: Suporte a diferentes moedas

### Para Administradores

- 👥 **Gestão de Parceiros/Usuários**: Listar, buscar, criar, ativar/desativar, deletar
- 💳 **Gestão de Planos**: CRUD completo de planos de assinatura (Free, Pro, Premium)
- 📝 **Gestão de Assinaturas**: Criar, editar e gerenciar assinaturas dos usuários
- 💰 **Gestão de Pagamentos**: Registrar e gerenciar pagamentos (cartão, PayPal, PIX, etc.)
- 📊 **Dashboard de Negócios**: KPIs financeiros, MRR, receita mensal, gráficos e métricas SaaS
- 📋 **Regras Fiscais**: CRUD completo de regras fiscais por país
- 👀 **Visualização**: Acesso ao dashboard de qualquer usuário
- ⚙️ **Configurações**: Alterar senha, email e perfil do admin

## 🛠️ Tecnologias

### Frontend
- **Next.js 14+** (App Router)
- **React 18+**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** (componentes UI)
- **Recharts** (gráficos)
- **React Hook Form** (formulários)
- **Zod** (validação)

### Backend
- **Next.js API Routes**
- **NextAuth v5** (autenticação)
- **Prisma ORM**
- **PostgreSQL**
- **bcryptjs** (hash de senhas)

### Ferramentas
- **ESLint** (linting)
- **Prettier** (formatação)
- **TypeScript** (type safety)

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **PostgreSQL** 14+ ([Download](https://www.postgresql.org/download/))
- **npm** ou **yarn**
- **Git**

## 🚀 Instalação

### 1. Clone o repositório

```bash
git clone <repository-url>
cd Cursor_app_motoboy
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
# Database
DATABASE_URL="postgresql://usuario:senha@localhost:5432/motoboy_db?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="sua-chave-secreta-aqui"

# App
NODE_ENV="development"
```

**Importante**: Gere uma chave secreta para `NEXTAUTH_SECRET`:

```bash
openssl rand -base64 32
```

### 4. Configure o banco de dados

**4.1. Crie o banco de dados PostgreSQL:**

```bash
# Via terminal PostgreSQL
createdb motoboy_db

# Ou via psql
psql -U postgres
CREATE DATABASE motoboy_db;
```

**4.2. Execute as migrations:**

```bash
npm run db:migrate
```

**4.3. Execute o seed (dados iniciais):**

```bash
npm run db:seed
```

Isso criará:
- ✅ Usuário admin padrão
- ✅ Tax rules para 13 países

### 5. Execute o servidor de desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## ⚙️ Configuração

### Variáveis de Ambiente

| Variável | Descrição | Obrigatório |
|----------|-----------|-------------|
| `DATABASE_URL` | URL de conexão do PostgreSQL | Sim |
| `NEXTAUTH_URL` | URL base da aplicação | Sim |
| `NEXTAUTH_SECRET` | Chave secreta para JWT | Sim |
| `NODE_ENV` | Ambiente (development/production) | Não |

### Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento

# Build
npm run build        # Cria build de produção
npm run start        # Inicia servidor de produção

# Database
npm run db:generate  # Gera Prisma Client
npm run db:migrate   # Executa migrations
npm run db:push      # Aplica schema sem migration
npm run db:studio    # Abre Prisma Studio
npm run db:seed      # Executa seed

# Qualidade
npm run lint         # Executa ESLint
```

## 📖 Uso

### Primeiro Acesso

1. Acesse a aplicação em `http://localhost:3000`
2. Você será redirecionado para a página de login
3. Use as credenciais do admin (veja [Credenciais de Teste](#-credenciais-de-teste))
4. Ou crie uma nova conta clicando em "Cadastre-se"

### Como Usuário

1. **Registre-se**: Crie sua conta com email, senha, nome, país e moeda
2. **Adicione Plataformas**: Vá em "Plataformas" e adicione suas plataformas de entrega
3. **Registre Receitas**: Vá em "Receitas" e registre suas receitas
4. **Registre Despesas**: Vá em "Despesas" e registre suas despesas
5. **Visualize Dashboard**: Veja seus KPIs e gráficos no dashboard

### Como Admin

1. **Faça login** com credenciais de admin
2. **Acesse o painel admin** em `/admin`
3. **Gerencie usuários** em `/admin/users`
4. **Gerencie regras fiscais** em `/admin/tax-rules`
5. **Visualize analytics** no dashboard admin

## 📁 Estrutura do Projeto

```
Cursor_app_motoboy/
├── app/                          # Next.js App Router
│   ├── (auth)/                  # Rotas de autenticação
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/             # Rotas do dashboard do usuário
│   │   ├── dashboard/
│   │   ├── income/
│   │   ├── expenses/
│   │   ├── platforms/
│   │   └── reports/
│   ├── (admin)/                 # Rotas do painel admin
│   │   └── admin/
│   │       ├── users/
│   │       └── tax-rules/
│   └── api/                     # API Routes
│       ├── auth/
│       ├── platforms/
│       ├── income/
│       ├── expenses/
│       ├── reports/
│       └── admin/
│
├── components/                   # Componentes React
│   ├── ui/                      # Componentes UI base
│   ├── charts/                  # Componentes de gráficos
│   ├── forms/                   # Formulários
│   ├── layout/                  # Layout components
│   ├── dashboard/               # Componentes do dashboard
│   ├── admin/                   # Componentes admin
│   └── providers/               # Context providers
│
├── lib/                         # Utilitários e configurações
│   ├── prisma.ts                # Prisma Client singleton
│   ├── auth.ts                  # NextAuth config
│   ├── validations/             # Schemas Zod
│   ├── utils/                   # Funções utilitárias
│   └── constants.ts             # Constantes
│
├── services/                    # Lógica de negócio
│   └── report.service.ts        # Serviços de relatórios
│
├── hooks/                       # React Hooks customizados
│   └── useAuth.ts
│
├── types/                       # TypeScript types
│   └── index.ts
│
├── prisma/                      # Prisma
│   ├── schema.prisma            # Schema do banco
│   ├── seed.ts                  # Seed data
│   └── migrations/              # Migrations
│
├── middleware.ts                # Next.js middleware
├── next.config.js               # Configuração Next.js
├── tailwind.config.ts           # Configuração Tailwind
├── tsconfig.json                # Configuração TypeScript
└── package.json                 # Dependências
```

## 📡 API Documentation

### Autenticação

#### POST `/api/auth/register`
Registra um novo usuário.

**Body:**
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123",
  "confirmPassword": "senha123",
  "country": "BR",
  "currency": "BRL"
}
```

#### POST `/api/auth/[...nextauth]`
Endpoint do NextAuth (login, logout, session).

### Plataformas

#### GET `/api/platforms`
Lista todas as plataformas do usuário autenticado.

#### POST `/api/platforms`
Cria uma nova plataforma.

**Body:**
```json
{
  "name": "Uber Eats"
}
```

#### GET `/api/platforms/[id]`
Obtém uma plataforma específica.

#### PUT `/api/platforms/[id]`
Atualiza uma plataforma.

#### DELETE `/api/platforms/[id]`
Desativa uma plataforma (soft delete).

### Receitas

#### GET `/api/income`
Lista todas as receitas do usuário.

**Query Params:**
- `platformId` (opcional): Filtrar por plataforma
- `startDate` (opcional): Data inicial
- `endDate` (opcional): Data final

#### POST `/api/income`
Cria uma nova receita.

**Body:**
```json
{
  "platformId": "clx123...",
  "amount": 150.50,
  "currency": "BRL",
  "date": "2024-01-15",
  "description": "Entrega no centro"
}
```

#### GET `/api/income/[id]`
Obtém uma receita específica.

#### PUT `/api/income/[id]`
Atualiza uma receita.

#### DELETE `/api/income/[id]`
Deleta uma receita.

### Despesas

#### GET `/api/expenses`
Lista todas as despesas do usuário.

**Query Params:**
- `category` (opcional): Filtrar por categoria
- `startDate` (opcional): Data inicial
- `endDate` (opcional): Data final

#### POST `/api/expenses`
Cria uma nova despesa.

**Body:**
```json
{
  "category": "fuel",
  "amount": 80.00,
  "currency": "BRL",
  "date": "2024-01-15",
  "description": "Abastecimento"
}
```

#### GET `/api/expenses/[id]`
Obtém uma despesa específica.

#### PUT `/api/expenses/[id]`
Atualiza uma despesa.

#### DELETE `/api/expenses/[id]`
Deleta uma despesa.

### Relatórios

#### GET `/api/reports/summary`
Obtém resumo financeiro.

**Query Params:**
- `startDate` (opcional)
- `endDate` (opcional)
- `platformId` (opcional)
- `category` (opcional)

**Response:**
```json
{
  "totalIncome": 5000.00,
  "totalExpenses": 2000.00,
  "netProfit": 3000.00,
  "estimatedTax": 450.00,
  "currency": "BRL"
}
```

#### GET `/api/reports/monthly`
Obtém dados mensais (receita vs despesas).

#### GET `/api/reports/platforms`
Obtém receita por plataforma.

#### GET `/api/reports/categories`
Obtém despesas por categoria.

### Admin APIs

#### GET `/api/admin/users`
Lista todos os usuários (apenas admin).

**Query Params:**
- `search` (opcional): Buscar por nome ou email
- `isActive` (opcional): Filtrar por status

#### PUT `/api/admin/users/[id]`
Atualiza um usuário (apenas admin).

#### DELETE `/api/admin/users/[id]`
Deleta um usuário (apenas admin).

#### GET `/api/admin/tax-rules`
Lista todas as regras fiscais (apenas admin).

#### POST `/api/admin/tax-rules`
Cria uma nova regra fiscal (apenas admin).

#### GET `/api/admin/analytics`
Obtém analytics globais (apenas admin).

## 🚀 Deploy

### Vercel (Recomendado)

1. **Instale a CLI da Vercel:**
```bash
npm i -g vercel
```

2. **Faça login:**
```bash
vercel login
```

3. **Configure as variáveis de ambiente** no dashboard da Vercel:
   - `DATABASE_URL`
   - `NEXTAUTH_URL`
   - `NEXTAUTH_SECRET`

4. **Deploy:**
```bash
vercel
```

### Outras Plataformas

#### Railway
1. Conecte seu repositório
2. Configure PostgreSQL
3. Adicione variáveis de ambiente
4. Deploy automático

#### Render
1. Crie um novo Web Service
2. Conecte o repositório
3. Configure PostgreSQL
4. Adicione variáveis de ambiente
5. Deploy

### Pré-requisitos para Deploy

- ✅ Banco de dados PostgreSQL acessível
- ✅ Variáveis de ambiente configuradas
- ✅ `NEXTAUTH_URL` apontando para a URL de produção
- ✅ `NEXTAUTH_SECRET` gerado e seguro

## 🔑 Credenciais de Teste

### Admin Padrão

Após executar o seed, você pode usar:

- **Email**: `admin@motoboy.app`
- **Senha**: `admin123`

⚠️ **IMPORTANTE**: Altere a senha do admin após o primeiro login em produção!

### Criar Usuário de Teste

1. Acesse `/register`
2. Preencha o formulário
3. Faça login com as credenciais criadas

## 🔒 Segurança

### Implementações de Segurança

- ✅ **Senhas**: Hash bcrypt com 12 salt rounds
- ✅ **Autenticação**: JWT tokens com expiração
- ✅ **Isolamento**: Multi-tenant com filtro por userId
- ✅ **Validação**: Zod schemas em todas as APIs
- ✅ **Proteção**: Middleware de autenticação
- ✅ **RBAC**: Role-based access control (USER/ADMIN)
- ✅ **CSRF**: Proteção via NextAuth
- ✅ **SQL Injection**: Proteção via Prisma

### Boas Práticas

1. **Nunca** commite o arquivo `.env`
2. **Sempre** use variáveis de ambiente para secrets
3. **Gere** uma nova `NEXTAUTH_SECRET` para produção
4. **Altere** a senha do admin padrão
5. **Use** HTTPS em produção
6. **Configure** rate limiting em produção

## 📝 Status do Projeto

### ✅ Todas as Fases Concluídas!

- ✅ **FASE 1**: Setup Inicial
- ✅ **FASE 2**: Database (Schema + Migrations + Seeds)
- ✅ **FASE 3**: Sistema de Autenticação
- ✅ **FASE 4**: CRUD Modules
- ✅ **FASE 5**: Dashboard + Gráficos
- ✅ **FASE 6**: Painel Admin
- ✅ **FASE 7**: Polimento e Validações
- ✅ **FASE 8**: Documentação Final

**🎉 Projeto 100% Completo e Pronto para Produção!**

## 🤝 Contribuindo

Este é um projeto privado. Para sugestões ou melhorias, entre em contato com a equipe de desenvolvimento.

## 📄 Licença

Este projeto é privado e proprietário.

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique a documentação
2. Consulte os arquivos de exemplo
3. Entre em contato com a equipe de desenvolvimento

---

**Desenvolvido com ❤️ para entregadores**
