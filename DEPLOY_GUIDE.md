# 🚀 Guia de Deploy

Guia completo para fazer deploy da aplicação em diferentes plataformas.

## 📋 Pré-requisitos

Antes de fazer deploy, certifique-se de:

1. ✅ Ter um banco de dados PostgreSQL acessível
2. ✅ Ter todas as variáveis de ambiente configuradas
3. ✅ Ter executado as migrations no banco de produção
4. ✅ Ter executado o seed (opcional, mas recomendado)

## 🌐 Vercel (Recomendado)

### 1. Instalação

```bash
npm i -g vercel
```

### 2. Login

```bash
vercel login
```

### 3. Deploy

```bash
# Deploy de preview
vercel

# Deploy de produção
vercel --prod
```

### 4. Configurar Variáveis de Ambiente

No dashboard da Vercel:

1. Vá em **Settings** → **Environment Variables**
2. Adicione:
   - `DATABASE_URL`: URL do PostgreSQL
   - `NEXTAUTH_URL`: URL da aplicação (ex: `https://seu-app.vercel.app`)
   - `NEXTAUTH_SECRET`: Chave secreta (gere com `openssl rand -base64 32`)
   - `NODE_ENV`: `production`

### 5. Configurar Build

A Vercel detecta automaticamente Next.js. Certifique-se de que o `package.json` tem:

```json
{
  "scripts": {
    "build": "next build",
    "start": "next start"
  }
}
```

### 6. Database Migrations

Execute as migrations no banco de produção:

```bash
# Localmente, apontando para produção
DATABASE_URL="postgresql://..." npm run db:migrate
```

Ou use o Prisma Studio:

```bash
DATABASE_URL="postgresql://..." npx prisma migrate deploy
```

## 🚂 Railway

### 1. Criar Projeto

1. Acesse [Railway](https://railway.app)
2. Clique em **New Project**
3. Selecione **Deploy from GitHub repo**

### 2. Adicionar PostgreSQL

1. No projeto, clique em **+ New**
2. Selecione **Database** → **PostgreSQL**
3. Railway criará automaticamente o banco

### 3. Configurar Variáveis

1. Vá em **Variables**
2. Adicione:
   - `DATABASE_URL`: Será preenchido automaticamente pelo Railway
   - `NEXTAUTH_URL`: URL do seu app Railway
   - `NEXTAUTH_SECRET`: Gere uma chave secreta
   - `NODE_ENV`: `production`

### 4. Deploy

O Railway fará deploy automático ao fazer push para o repositório.

### 5. Migrations

Execute via Railway CLI:

```bash
railway run npm run db:migrate
```

## 🎨 Render

### 1. Criar Web Service

1. Acesse [Render](https://render.com)
2. Clique em **New** → **Web Service**
3. Conecte seu repositório GitHub

### 2. Configurações

- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Environment**: `Node`

### 3. Adicionar PostgreSQL

1. No dashboard, clique em **New** → **PostgreSQL**
2. Anote a connection string

### 4. Variáveis de Ambiente

No Web Service, vá em **Environment** e adicione:

- `DATABASE_URL`: Connection string do PostgreSQL
- `NEXTAUTH_URL`: URL do seu app Render
- `NEXTAUTH_SECRET`: Chave secreta
- `NODE_ENV`: `production`

### 5. Migrations

Execute via Shell do Render ou localmente:

```bash
DATABASE_URL="postgresql://..." npm run db:migrate
```

## 🐳 Docker (Opcional)

### Dockerfile

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://user:password@db:5432/motoboy_db
      - NEXTAUTH_URL=http://localhost:3000
      - NEXTAUTH_SECRET=your-secret
      - NODE_ENV=production
    depends_on:
      - db

  db:
    image: postgres:14
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=motoboy_db
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Build e Run

```bash
docker-compose up -d
```

## 📝 Checklist de Deploy

Antes de fazer deploy, verifique:

- [ ] Banco de dados PostgreSQL criado e acessível
- [ ] Variáveis de ambiente configuradas
- [ ] `NEXTAUTH_URL` apontando para URL de produção
- [ ] `NEXTAUTH_SECRET` gerado e seguro
- [ ] Migrations executadas no banco de produção
- [ ] Seed executado (opcional)
- [ ] Build local funcionando (`npm run build`)
- [ ] Testes básicos realizados

## 🔧 Pós-Deploy

### 1. Verificar Migrations

```bash
# Verificar status
npx prisma migrate status

# Aplicar migrations pendentes
npx prisma migrate deploy
```

### 2. Verificar Seed

Se necessário, execute o seed:

```bash
DATABASE_URL="postgresql://..." npm run db:seed
```

### 3. Testar Aplicação

1. Acesse a URL de produção
2. Teste login/registro
3. Teste criação de dados
4. Verifique dashboard
5. Teste funcionalidades admin (se aplicável)

### 4. Monitoramento

Configure:
- Logs da aplicação
- Monitoramento de erros (Sentry, etc.)
- Alertas de downtime
- Backup do banco de dados

## 🐛 Troubleshooting

### Erro de Conexão com Banco

- Verifique se `DATABASE_URL` está correto
- Verifique se o banco está acessível
- Verifique firewall/security groups

### Erro de Autenticação

- Verifique se `NEXTAUTH_SECRET` está configurado
- Verifique se `NEXTAUTH_URL` está correto
- Limpe cookies e tente novamente

### Erro de Build

- Verifique logs de build
- Verifique se todas as dependências estão no `package.json`
- Verifique se não há erros de TypeScript

### Migrations Falhando

- Verifique conexão com banco
- Verifique se o banco está vazio ou tem migrations antigas
- Use `prisma migrate reset` (cuidado: apaga dados!)

## 📚 Recursos Adicionais

- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Render Documentation](https://render.com/docs)

---

**Boa sorte com o deploy! 🚀**



