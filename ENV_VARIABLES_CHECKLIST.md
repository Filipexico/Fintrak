# 📋 Checklist de Variáveis de Ambiente - Fintrak

## 🔴 Variáveis OBRIGATÓRIAS

Estas variáveis **DEVEM** estar configuradas tanto localmente quanto no Vercel para o sistema funcionar.

### 1. `NEXTAUTH_SECRET` ⚠️ CRÍTICO
- **Descrição**: Chave secreta usada para assinar e criptografar tokens JWT do NextAuth
- **Obrigatória**: ✅ SIM
- **Formato**: String aleatória (base64)
- **Como gerar**:
  ```bash
  openssl rand -base64 32
  ```
- **Exemplo** (NÃO use este valor em produção):
  ```
  NEXTAUTH_SECRET="aBc123XyZ456DeF789GhI012JkL345MnO678PqR901StU234VwX567YzA890="
  ```
- **Local (.env)**:
  ```env
  NEXTAUTH_SECRET="sua-chave-gerada-aqui"
  ```
- **Vercel**: ✅ **DEVE estar configurada**
  - Settings → Environment Variables → Add New
  - Key: `NEXTAUTH_SECRET`
  - Value: (cole a chave gerada)
  - Environments: Production, Preview, Development

### 2. `DATABASE_URL` ⚠️ CRÍTICO
- **Descrição**: URL de conexão com o banco de dados PostgreSQL (Neon)
- **Obrigatória**: ✅ SIM
- **Formato**: String de conexão PostgreSQL
- **Exemplo** (Neon):
  ```
  DATABASE_URL="postgresql://neondb_owner:npg_82yLYliJqpCj@ep-dawn-frog-agjjr2rn-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
  ```
- **Local (.env)**:
  ```env
  DATABASE_URL="postgresql://usuario:senha@host:porta/banco?sslmode=require"
  ```
- **Vercel**: ✅ **DEVE estar configurada**
  - Settings → Environment Variables → Add New
  - Key: `DATABASE_URL`
  - Value: (cole a URL do Neon)
  - Environments: Production, Preview, Development

### 3. `NEXTAUTH_URL` ⚠️ RECOMENDADO (mas tem fallback)
- **Descrição**: URL base da aplicação (usada para callbacks e redirecionamentos)
- **Obrigatória**: ⚠️ RECOMENDADO (tem fallback automático, mas é melhor configurar)
- **Formato**: URL completa com protocolo
- **Local (.env)**:
  ```env
  NEXTAUTH_URL="http://localhost:3000"
  ```
- **Vercel**: ✅ **RECOMENDADO configurar**
  - Settings → Environment Variables → Add New
  - Key: `NEXTAUTH_URL`
  - Value: `https://fintrak-omega.vercel.app`
  - Environments: Production
  - ⚠️ **IMPORTANTE**: Use `https://` (não `http://`)

---

## 🟡 Variáveis OPCIONAIS (para funcionalidades extras)

Estas variáveis são **opcionais** e só são necessárias se você quiser usar as funcionalidades relacionadas.

### 4. `SMTP_HOST` (Opcional - para envio de emails)
- **Descrição**: Servidor SMTP para envio de emails
- **Obrigatória**: ❌ NÃO
- **Quando usar**: Se quiser que o sistema envie emails (contato, pagamentos, etc.)
- **Exemplo**:
  ```env
  SMTP_HOST="smtp.gmail.com"
  ```
- **Vercel**: Opcional (configure se quiser emails)

### 5. `SMTP_PORT` (Opcional - para envio de emails)
- **Descrição**: Porta do servidor SMTP
- **Obrigatória**: ❌ NÃO
- **Quando usar**: Junto com `SMTP_HOST`
- **Exemplo**:
  ```env
  SMTP_PORT="587"
  ```
- **Vercel**: Opcional (configure se quiser emails)

### 6. `SMTP_USER` (Opcional - para envio de emails)
- **Descrição**: Usuário/email para autenticação SMTP
- **Obrigatória**: ❌ NÃO
- **Quando usar**: Junto com `SMTP_HOST`
- **Exemplo**:
  ```env
  SMTP_USER="seu-email@gmail.com"
  ```
- **Vercel**: Opcional (configure se quiser emails)

### 7. `SMTP_PASS` (Opcional - para envio de emails)
- **Descrição**: Senha ou senha de app para autenticação SMTP
- **Obrigatória**: ❌ NÃO
- **Quando usar**: Junto com `SMTP_HOST`
- **Exemplo** (Gmail com senha de app):
  ```env
  SMTP_PASS="xxxx xxxx xxxx xxxx"
  ```
- **Vercel**: Opcional (configure se quiser emails)

### 8. `SMTP_FROM` (Opcional - para envio de emails)
- **Descrição**: Email remetente (padrão: usa `SMTP_USER` ou `noreply@fintrak.com`)
- **Obrigatória**: ❌ NÃO
- **Quando usar**: Se quiser um email remetente diferente
- **Exemplo**:
  ```env
  SMTP_FROM="noreply@fintrak.com"
  ```
- **Vercel**: Opcional (configure se quiser emails)

### 9. `NODE_ENV` (Automático)
- **Descrição**: Ambiente de execução (development/production)
- **Obrigatória**: ❌ NÃO (definido automaticamente)
- **Nota**: O Vercel define automaticamente como `production` em produção

---

## ✅ Checklist de Configuração

### Para Desenvolvimento Local (.env)

Crie um arquivo `.env` na raiz do projeto com:

```env
# ⚠️ OBRIGATÓRIAS
DATABASE_URL="postgresql://usuario:senha@host:porta/banco?sslmode=require"
NEXTAUTH_SECRET="sua-chave-gerada-com-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"

# 🟡 OPCIONAIS (para emails)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="seu-email@gmail.com"
SMTP_PASS="sua-senha-de-app"
SMTP_FROM="noreply@fintrak.com"
```

**Passos**:
- [ ] Gerar `NEXTAUTH_SECRET` com `openssl rand -base64 32`
- [ ] Configurar `DATABASE_URL` com a URL do Neon
- [ ] Configurar `NEXTAUTH_URL` como `http://localhost:3000`
- [ ] (Opcional) Configurar variáveis SMTP se quiser emails

### Para Produção (Vercel)

Acesse: **Vercel Dashboard → Seu Projeto → Settings → Environment Variables**

**Variáveis Obrigatórias**:
- [ ] `NEXTAUTH_SECRET` = (cole a mesma chave usada localmente ou gere uma nova)
- [ ] `DATABASE_URL` = (cole a URL do Neon)
- [ ] `NEXTAUTH_URL` = `https://fintrak-omega.vercel.app`

**Variáveis Opcionais** (se quiser emails):
- [ ] `SMTP_HOST` = `smtp.gmail.com` (ou seu provedor)
- [ ] `SMTP_PORT` = `587`
- [ ] `SMTP_USER` = seu email
- [ ] `SMTP_PASS` = sua senha de app
- [ ] `SMTP_FROM` = `noreply@fintrak.com`

**Após configurar**:
- [ ] Fazer **redeploy** no Vercel (ou aguardar o próximo deploy)

---

## 🔍 Como Verificar se Está Configurado Corretamente

### 1. Verificar Erro no Build/Deploy

Se `NEXTAUTH_SECRET` estiver faltando, você verá um erro como:
```
❌ Variáveis de ambiente obrigatórias faltando: NEXTAUTH_SECRET
```

### 2. Verificar Erro 500 em `/api/auth/session`

Se acessar `/api/auth/session` e receber erro 500 com "There was a problem with the server configuration", significa que:
- `NEXTAUTH_SECRET` está faltando ou vazio
- `NEXTAUTH_URL` pode estar incorreto (mas tem fallback)

### 3. Testar Login

1. Acesse `https://fintrak-omega.vercel.app/login`
2. Tente fazer login
3. Se funcionar, as variáveis estão corretas ✅
4. Se não funcionar, verifique os logs do Vercel

---

## 🛠️ Troubleshooting

### Erro: "There was a problem with the server configuration"

**Causa**: `NEXTAUTH_SECRET` está faltando ou vazio

**Solução**:
1. Gere uma nova chave: `openssl rand -base64 32`
2. Adicione no Vercel: Settings → Environment Variables
3. Faça redeploy

### Erro: "Email ou senha inválidos" (mas credenciais estão corretas)

**Causa**: Problema de conexão com banco de dados ou `DATABASE_URL` incorreta

**Solução**:
1. Verifique se `DATABASE_URL` está configurada no Vercel
2. Verifique se a URL do Neon está correta
3. Teste a conexão localmente primeiro

### Erro: Redirecionamento infinito após login

**Causa**: `NEXTAUTH_URL` incorreto ou cookies não sendo criados

**Solução**:
1. Configure `NEXTAUTH_URL=https://fintrak-omega.vercel.app` no Vercel
2. Limpe os cookies do navegador
3. Faça redeploy

### Emails não estão sendo enviados

**Causa**: Variáveis SMTP não configuradas ou incorretas

**Solução**:
1. Verifique se todas as variáveis SMTP estão configuradas
2. Para Gmail, use uma "senha de app" (não a senha normal)
3. Verifique os logs do Vercel para erros de SMTP

---

## 📝 Resumo Rápido

### Mínimo Necessário (Login Funciona)

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="chave-gerada-com-openssl"
NEXTAUTH_URL="https://fintrak-omega.vercel.app"  # Recomendado
```

### Completo (Login + Emails)

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="chave-gerada-com-openssl"
NEXTAUTH_URL="https://fintrak-omega.vercel.app"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="seu-email@gmail.com"
SMTP_PASS="senha-de-app"
SMTP_FROM="noreply@fintrak.com"
```

---

## 🔗 Links Úteis

- [NextAuth.js v5 Documentation](https://authjs.dev/)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Neon Database Connection](https://neon.tech/docs/connect/connect-from-any-app)
- [Gmail App Passwords](https://myaccount.google.com/apppasswords)


