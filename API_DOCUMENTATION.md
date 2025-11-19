# 📡 Documentação da API

Documentação completa das APIs do sistema de controle financeiro para entregadores.

## 🔐 Autenticação

Todas as rotas (exceto `/api/auth/*`) requerem autenticação via NextAuth. O token JWT é enviado automaticamente via cookies.

### Endpoints de Autenticação

#### POST `/api/auth/register`

Registra um novo usuário no sistema.

**Request Body:**
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

**Response (201):**
```json
{
  "message": "Usuário criado com sucesso",
  "user": {
    "id": "clx123...",
    "email": "joao@example.com",
    "name": "João Silva",
    "role": "USER"
  }
}
```

**Erros:**
- `400`: Dados inválidos ou email já cadastrado
- `500`: Erro interno do servidor

---

## 📦 Plataformas

### GET `/api/platforms`

Lista todas as plataformas do usuário autenticado.

**Response (200):**
```json
[
  {
    "id": "clx123...",
    "name": "Uber Eats",
    "isActive": true,
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z"
  }
]
```

### POST `/api/platforms`

Cria uma nova plataforma.

**Request Body:**
```json
{
  "name": "Uber Eats"
}
```

**Response (201):**
```json
{
  "id": "clx123...",
  "name": "Uber Eats",
  "isActive": true,
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

**Erros:**
- `400`: Nome já existe ou dados inválidos

### GET `/api/platforms/[id]`

Obtém uma plataforma específica.

**Response (200):**
```json
{
  "id": "clx123...",
  "name": "Uber Eats",
  "isActive": true,
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

**Erros:**
- `404`: Plataforma não encontrada

### PUT `/api/platforms/[id]`

Atualiza uma plataforma.

**Request Body:**
```json
{
  "name": "Uber Eats Atualizado",
  "isActive": true
}
```

**Response (200):**
```json
{
  "id": "clx123...",
  "name": "Uber Eats Atualizado",
  "isActive": true,
  "updatedAt": "2024-01-15T11:00:00Z"
}
```

### DELETE `/api/platforms/[id]`

Desativa uma plataforma (soft delete).

**Response (200):**
```json
{
  "message": "Plataforma desativada com sucesso"
}
```

---

## 💰 Receitas

### GET `/api/income`

Lista todas as receitas do usuário.

**Query Parameters:**
- `platformId` (opcional): Filtrar por plataforma
- `startDate` (opcional): Data inicial (ISO format)
- `endDate` (opcional): Data final (ISO format)

**Exemplo:**
```
GET /api/income?platformId=clx123&startDate=2024-01-01&endDate=2024-01-31
```

**Response (200):**
```json
[
  {
    "id": "clx456...",
    "platformId": "clx123...",
    "platform": {
      "id": "clx123...",
      "name": "Uber Eats"
    },
    "amount": "150.50",
    "currency": "BRL",
    "date": "2024-01-15T00:00:00Z",
    "description": "Entrega no centro",
    "createdAt": "2024-01-15T10:00:00Z"
  }
]
```

### POST `/api/income`

Cria uma nova receita.

**Request Body:**
```json
{
  "platformId": "clx123...",
  "amount": 150.50,
  "currency": "BRL",
  "date": "2024-01-15",
  "description": "Entrega no centro"
}
```

**Response (201):**
```json
{
  "id": "clx456...",
  "platformId": "clx123...",
  "platform": {
    "id": "clx123...",
    "name": "Uber Eats"
  },
  "amount": "150.50",
  "currency": "BRL",
  "date": "2024-01-15T00:00:00Z",
  "description": "Entrega no centro"
}
```

### GET `/api/income/[id]`

Obtém uma receita específica.

### PUT `/api/income/[id]`

Atualiza uma receita.

### DELETE `/api/income/[id]`

Deleta uma receita.

---

## 💸 Despesas

### GET `/api/expenses`

Lista todas as despesas do usuário.

**Query Parameters:**
- `category` (opcional): Filtrar por categoria
- `startDate` (opcional): Data inicial
- `endDate` (opcional): Data final

**Categorias disponíveis:**
- `fuel` - Combustível
- `insurance` - Seguro
- `phone` - Telefone
- `maintenance` - Manutenção
- `food` - Alimentação
- `parking` - Estacionamento
- `tolls` - Pedágio
- `other` - Outros

**Response (200):**
```json
[
  {
    "id": "clx789...",
    "category": "fuel",
    "amount": "80.00",
    "currency": "BRL",
    "date": "2024-01-15T00:00:00Z",
    "description": "Abastecimento",
    "createdAt": "2024-01-15T10:00:00Z"
  }
]
```

### POST `/api/expenses`

Cria uma nova despesa.

**Request Body:**
```json
{
  "category": "fuel",
  "amount": 80.00,
  "currency": "BRL",
  "date": "2024-01-15",
  "description": "Abastecimento"
}
```

### GET `/api/expenses/[id]`

Obtém uma despesa específica.

### PUT `/api/expenses/[id]`

Atualiza uma despesa.

### DELETE `/api/expenses/[id]`

Deleta uma despesa.

---

## 📊 Relatórios

### GET `/api/reports/summary`

Obtém resumo financeiro do usuário.

**Query Parameters:**
- `startDate` (opcional): Data inicial
- `endDate` (opcional): Data final
- `platformId` (opcional): Filtrar por plataforma
- `category` (opcional): Filtrar por categoria de despesa

**Response (200):**
```json
{
  "totalIncome": 5000.00,
  "totalExpenses": 2000.00,
  "netProfit": 3000.00,
  "estimatedTax": 450.00,
  "currency": "BRL"
}
```

### GET `/api/reports/monthly`

Obtém dados mensais (receita vs despesas).

**Query Parameters:**
- `startDate` (opcional)
- `endDate` (opcional)

**Response (200):**
```json
[
  {
    "month": "jan 2024",
    "income": 2000.00,
    "expenses": 800.00,
    "profit": 1200.00
  }
]
```

### GET `/api/reports/platforms`

Obtém receita agrupada por plataforma.

**Response (200):**
```json
[
  {
    "platformId": "clx123...",
    "platformName": "Uber Eats",
    "total": 3000.00,
    "percentage": 60.0
  },
  {
    "platformId": null,
    "platformName": "Sem Plataforma",
    "total": 2000.00,
    "percentage": 40.0
  }
]
```

### GET `/api/reports/categories`

Obtém despesas agrupadas por categoria.

**Response (200):**
```json
[
  {
    "category": "fuel",
    "total": 800.00,
    "percentage": 40.0
  },
  {
    "category": "food",
    "total": 600.00,
    "percentage": 30.0
  }
]
```

---

## 👨‍💼 Admin APIs

Todas as rotas admin requerem role `ADMIN`.

### GET `/api/admin/users`

Lista todos os usuários do sistema.

**Query Parameters:**
- `search` (opcional): Buscar por nome ou email
- `isActive` (opcional): Filtrar por status (true/false)

**Response (200):**
```json
[
  {
    "id": "clx111...",
    "email": "user@example.com",
    "name": "João Silva",
    "country": "BR",
    "currency": "BRL",
    "role": "USER",
    "isActive": true,
    "createdAt": "2024-01-15T10:00:00Z",
    "_count": {
      "incomes": 10,
      "expenses": 5,
      "platforms": 2
    }
  }
]
```

### GET `/api/admin/users/[id]`

Obtém um usuário específico.

### PUT `/api/admin/users/[id]`

Atualiza um usuário.

**Request Body:**
```json
{
  "isActive": false,
  "role": "ADMIN"
}
```

### DELETE `/api/admin/users/[id]`

Deleta um usuário permanentemente.

### GET `/api/admin/tax-rules`

Lista todas as regras fiscais.

**Response (200):**
```json
[
  {
    "id": "clx222...",
    "country": "BR",
    "displayName": "Brasil",
    "percentage": "0.1500",
    "isActive": true
  }
]
```

### POST `/api/admin/tax-rules`

Cria uma nova regra fiscal.

**Request Body:**
```json
{
  "country": "BR",
  "displayName": "Brasil",
  "percentage": 0.15,
  "isActive": true
}
```

### GET `/api/admin/analytics`

Obtém analytics globais do sistema.

**Response (200):**
```json
{
  "totalUsers": 100,
  "activeUsers": 95,
  "inactiveUsers": 5,
  "totalIncomes": {
    "count": 1000,
    "sum": 500000.00
  },
  "totalExpenses": {
    "count": 500,
    "sum": 200000.00
  },
  "totalPlatforms": 50,
  "usersByCountry": [
    {
      "country": "BR",
      "count": 80
    }
  ],
  "recentUsers": [...]
}
```

### GET `/api/admin/users/[id]/dashboard`

Obtém dashboard completo de um usuário específico.

**Query Parameters:**
- `startDate` (opcional)
- `endDate` (opcional)

**Response (200):**
```json
{
  "summary": {
    "totalIncome": 5000.00,
    "totalExpenses": 2000.00,
    "netProfit": 3000.00,
    "estimatedTax": 450.00,
    "currency": "BRL"
  },
  "monthlyData": [...],
  "platformData": [...],
  "categoryData": [...]
}
```

---

## ⚠️ Códigos de Erro

- `200`: Sucesso
- `201`: Criado com sucesso
- `400`: Requisição inválida (validação falhou)
- `401`: Não autenticado
- `403`: Não autorizado (sem permissão)
- `404`: Recurso não encontrado
- `500`: Erro interno do servidor

---

## 🔒 Segurança

- Todas as rotas (exceto `/api/auth/register`) requerem autenticação
- Rotas admin requerem role `ADMIN`
- Todas as queries filtram por `userId` (isolamento multi-tenant)
- Validação de dados com Zod em todas as rotas
- Proteção contra SQL injection via Prisma

---

**Última atualização**: Janeiro 2024




