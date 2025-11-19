# 📋 PLANO TÉCNICO - Sistema de Controle Financeiro para Entregadores

## 🎯 Visão Geral

Aplicação web multi-tenant para controle financeiro de entregadores (couriers) com isolamento completo de dados por usuário e painel administrativo com role-based access control (RBAC).

---

## 🗄️ SCHEMA DO BANCO DE DADOS

### Diagrama Entidade-Relacionamento

```
┌─────────────┐
│    User     │
├─────────────┤
│ id (PK)     │
│ email (UK)  │
│ password    │
│ name        │
│ country     │
│ currency    │
│ role        │ (USER | ADMIN)
│ isActive    │
│ createdAt   │
│ updatedAt   │
└──────┬──────┘
       │
       │ 1:N
       │
┌──────▼──────────────┐
│   Platform          │
├─────────────────────┤
│ id (PK)             │
│ userId (FK)         │
│ name                │ (Uber Eats, iFood, etc.)
│ isActive            │
│ createdAt           │
│ updatedAt           │
└──────┬──────────────┘
       │
       │ 1:N
       │
┌──────▼──────────────┐
│   Income            │
├─────────────────────┤
│ id (PK)             │
│ userId (FK)         │
│ platformId (FK)     │
│ amount              │
│ currency            │
│ date                │
│ description         │
│ createdAt           │
│ updatedAt           │
└─────────────────────┘

┌─────────────┐
│   Expense   │
├─────────────┤
│ id (PK)     │
│ userId (FK) │
│ category    │ (fuel, insurance, phone, maintenance, etc.)
│ amount      │
│ currency    │
│ date        │
│ description │
│ createdAt   │
│ updatedAt   │
└─────────────┘

┌─────────────┐
│  TaxRule    │
├─────────────┤
│ id (PK)     │
│ country     │ (ISO code: BR, US, etc.)
│ displayName │
│ percentage  │ (decimal: 0.15 = 15%)
│ isActive    │
│ createdAt   │
│ updatedAt   │
└─────────────┘
```

### Modelos Prisma Detalhados

**User**
- Isolamento por tenant (cada usuário vê apenas seus dados)
- Role-based: USER ou ADMIN
- Campos de localização para tax rules

**Platform**
- Relacionamento 1:N com User (cada usuário gerencia suas plataformas)
- Soft delete via isActive

**Income**
- Relacionamento com User e Platform
- Suporte multi-moeda
- Indexação por data para queries rápidas

**Expense**
- Categorização fixa (enum) para consistência
- Relacionamento apenas com User
- Indexação por data e categoria

**TaxRule**
- Tabela global (não por usuário)
- Apenas admins podem gerenciar
- Usado para cálculos de imposto estimado

---

## 📁 ARQUITETURA DE PASTAS

```
Cursor_app_motoboy/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
│
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   ├── register/
│   │   └── forgot-password/
│   │
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   ├── income/
│   │   ├── expenses/
│   │   ├── platforms/
│   │   ├── reports/
│   │   └── profile/
│   │
│   ├── (admin)/
│   │   ├── admin/
│   │   │   ├── users/
│   │   │   ├── tax-rules/
│   │   │   └── analytics/
│   │   └── layout.tsx (middleware de role)
│   │
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   ├── income/
│   │   ├── expenses/
│   │   ├── platforms/
│   │   ├── reports/
│   │   └── admin/
│   │
│   ├── layout.tsx
│   └── page.tsx (redirect baseado em auth)
│
├── components/
│   ├── ui/ (shadcn/ui components)
│   ├── charts/
│   ├── forms/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── AdminSidebar.tsx
│   └── protected/
│
├── lib/
│   ├── prisma.ts (PrismaClient singleton)
│   ├── auth.ts (NextAuth config)
│   ├── validations/ (Zod schemas)
│   ├── utils.ts
│   └── constants.ts
│
├── hooks/
│   ├── useAuth.ts
│   ├── useIncome.ts
│   ├── useExpenses.ts
│   └── useReports.ts
│
├── services/
│   ├── income.service.ts
│   ├── expense.service.ts
│   ├── report.service.ts
│   └── tax.service.ts
│
├── types/
│   └── index.ts
│
├── middleware.ts (Next.js middleware para auth)
│
├── .env.example
├── .gitignore
├── next.config.js
├── package.json
├── tsconfig.json
└── README.md
```

---

## 📦 BIBLIOTECAS E JUSTIFICATIVAS

### Core
- **next@latest**: Framework React com SSR/SSG, App Router
- **react@latest** + **react-dom@latest**: UI library
- **typescript**: Type safety

### Database & ORM
- **@prisma/client**: ORM type-safe
- **prisma**: CLI para migrations
- **postgresql**: Banco de dados relacional

### Autenticação
- **next-auth@beta** (v5): Autenticação segura com JWT, sessions, providers
- **bcryptjs**: Hash de senhas
- **@types/bcryptjs**: Types para bcryptjs

### Validação
- **zod**: Schema validation (client + server)
- **@hookform/resolvers**: Integração Zod + React Hook Form

### Forms
- **react-hook-form**: Gerenciamento de formulários performático

### UI Components
- **shadcn/ui**: Componentes acessíveis e customizáveis (baseado em Radix UI)
- **tailwindcss**: Utility-first CSS
- **lucide-react**: Ícones

### Charts
- **recharts**: Biblioteca de gráficos React flexível e performática

### Utilitários
- **date-fns**: Manipulação de datas
- **clsx** + **tailwind-merge**: Utilitários para classes CSS

### Desenvolvimento
- **eslint**: Linter
- **prettier**: Formatação de código
- **@types/node**: Types para Node.js

---

## 🔒 CONSIDERAÇÕES DE SEGURANÇA

### 1. Autenticação & Autorização
- ✅ Senhas hasheadas com bcrypt (salt rounds: 12)
- ✅ JWT tokens com expiração
- ✅ Middleware de autenticação em todas as rotas protegidas
- ✅ Role-based access control (RBAC) para admin
- ✅ CSRF protection via NextAuth
- ✅ Rate limiting em endpoints de autenticação

### 2. Isolamento de Dados (Multi-tenant)
- ✅ **TODAS** as queries filtram por `userId` do usuário autenticado
- ✅ Validação de ownership antes de operações CRUD
- ✅ Middleware que injeta `userId` em todas as requisições
- ✅ NUNCA expor dados de outros usuários

### 3. Validação de Input
- ✅ Zod schemas em todas as rotas API
- ✅ Sanitização de inputs
- ✅ Validação de tipos e ranges
- ✅ Proteção contra SQL injection (Prisma já protege)

### 4. Segurança de API
- ✅ CORS configurado adequadamente
- ✅ Headers de segurança (helmet-like)
- ✅ Validação de permissões em cada endpoint
- ✅ Logs de ações administrativas

### 5. Secrets & Environment
- ✅ Variáveis sensíveis apenas em `.env`
- ✅ `.env.example` sem valores reais
- ✅ `.env` no `.gitignore`
- ✅ Secrets nunca commitados

### 6. Database
- ✅ Prepared statements via Prisma
- ✅ Índices para performance e segurança
- ✅ Constraints de foreign key
- ✅ Soft deletes quando apropriado

---

## 🎨 FLUXO UX SUGERIDO

### Usuário Regular

1. **Onboarding**
   - Registro → Email + Senha + Nome + País + Moeda
   - Login → Dashboard vazio com onboarding

2. **Configuração Inicial**
   - Adicionar primeira plataforma (Uber Eats, iFood, etc.)
   - Tutorial rápido (opcional)

3. **Dashboard Principal**
   - Cards com KPIs: Receita Total | Despesas | Lucro Líquido | Imposto Estimado
   - Gráfico: Receita vs Despesas (mensal)
   - Gráfico: Receita por Plataforma (pie chart)
   - Gráfico: Despesas por Categoria (bar chart)
   - Tabela: Últimas transações

4. **Gestão de Dados**
   - **Receitas**: Lista → Adicionar → Editar → Deletar
   - **Despesas**: Lista → Adicionar → Editar → Deletar
   - **Plataformas**: Lista → Adicionar → Editar → Desativar
   - Filtros: Data (range) | Plataforma | Categoria

5. **Relatórios**
   - Seleção de período (diário, mensal, anual)
   - Exportação (futuro: PDF/CSV)

6. **Perfil**
   - Editar dados pessoais
   - Alterar senha
   - Configurações de moeda

### Admin

1. **Login Admin**
   - Mesmo fluxo, mas redireciona para `/admin`

2. **Dashboard Admin**
   - KPIs: Total de Usuários | Receita Total Rastreada | Despesas Totais | Usuários Ativos/Inativos
   - Gráficos: Crescimento de usuários | Uso por país

3. **Gestão de Usuários**
   - Lista com busca e filtros
   - Visualizar dashboard de qualquer usuário
   - Ativar/Desativar/Deletar usuários

4. **Gestão de Tax Rules**
   - CRUD completo de regras fiscais
   - Validação de país único

5. **Analytics Globais**
   - Estatísticas agregadas (sem dados pessoais)

---

## 🚀 PRÓXIMOS PASSOS (ORDEM DE IMPLEMENTAÇÃO)

### ✅ FASE 1: Setup Inicial
1. Inicializar projeto Next.js com TypeScript
2. Configurar Prisma + PostgreSQL
3. Criar estrutura de pastas
4. Configurar ESLint + Prettier
5. Setup Tailwind CSS + shadcn/ui

### ✅ FASE 2: Database
1. Criar schema Prisma completo
2. Gerar migrations
3. Criar seed data (usuário admin + tax rules iniciais)

### ✅ FASE 3: Autenticação
1. Configurar NextAuth
2. Implementar registro/login
3. Middleware de autenticação
4. Proteção de rotas

### ✅ FASE 4: Módulos CRUD
1. Plataformas (CRUD)
2. Receitas (CRUD)
3. Despesas (CRUD)
4. Validações e isolamento de dados

### ✅ FASE 5: Dashboard & Relatórios
1. Serviços de cálculo (receita, despesas, lucro, imposto)
2. Componentes de gráficos
3. Dashboard principal
4. Página de relatórios

### ✅ FASE 6: Admin Panel
1. Middleware de role (admin)
2. Dashboard admin
3. Gestão de usuários
4. Gestão de tax rules
5. Analytics globais

### ✅ FASE 7: Polimento
1. Validações finais
2. Tratamento de erros
3. Loading states
4. Mensagens de feedback
5. Responsividade

### ✅ FASE 8: Documentação
1. README.md completo
2. .env.example
3. Instruções de deploy
4. Credenciais de teste

---

## 📊 MÉTRICAS DE SUCESSO

- ✅ Isolamento completo de dados por usuário
- ✅ Performance: Dashboard carrega em < 2s
- ✅ Segurança: Zero vulnerabilidades conhecidas
- ✅ UX: Interface intuitiva e responsiva
- ✅ Escalabilidade: Suporta 10k+ usuários
- ✅ Manutenibilidade: Código limpo e documentado

---

## ❓ DECISÕES ARQUITETURAIS

### Por que Next.js App Router?
- RSC (React Server Components) para melhor performance
- API Routes integradas
- Middleware nativo
- Suporte completo a TypeScript

### Por que Prisma?
- Type-safety end-to-end
- Migrations automáticas
- Query builder intuitivo
- Excelente DX

### Por que NextAuth?
- Padrão da indústria
- Suporte a múltiplos providers (futuro)
- JWT + sessions
- CSRF protection built-in

### Por que shadcn/ui?
- Componentes acessíveis (Radix UI)
- Customizável (não é uma dependência)
- Tailwind CSS nativo
- Excelente para SaaS

### Por que Recharts?
- Flexível e performático
- Boa documentação
- Suporte a TypeScript
- Responsivo

---

**Status**: ✅ Plano Técnico Completo - Aguardando Aprovação

**Próximo Passo**: Após aprovação, iniciar FASE 1 (Setup Inicial)

