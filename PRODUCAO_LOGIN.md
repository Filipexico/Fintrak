# 🔐 Solução para Problemas de Login em Produção

## Problema Identificado

O usuário admin existe no banco de dados e a senha está correta, mas não consegue fazer login em produção.

## Credenciais de Acesso

**Admin Principal:**
- Email: `admin@fintrak.app`
- Senha: `@Rosa1809`

**Admin Alternativo (se necessário):**
- Email: `admin@example.com`
- Senha: `Admin123!`

## Solução: Configurar NEXTAUTH_URL para Produção

### Problema
O arquivo `.env` local está configurado com:
```
NEXTAUTH_URL="http://localhost:3000"
```

Mas em **produção** (Vercel), você precisa configurar a URL do seu site.

### Solução no Vercel

1. Acesse o painel do Vercel
2. Vá em **Settings** → **Environment Variables**
3. Configure a seguinte variável:

   ```
   NEXTAUTH_URL=https://fintrak-omega.vercel.app
   ```
   
   ⚠️ **IMPORTANTE**: Use `https://` (não `http://`)

4. Também verifique se estas variáveis estão configuradas:
   - `DATABASE_URL` - já configurado para Neon ✅
   - `NEXTAUTH_SECRET` - deve estar configurado
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` (opcionais, para emails)

5. Após configurar, faça um **redeploy** no Vercel

### Como Verificar

Após configurar e fazer redeploy:

1. Acesse: `https://fintrak-omega.vercel.app/login`
2. Use as credenciais:
   - Email: `admin@fintrak.app`
   - Senha: `@Rosa1809`
3. Se ainda não funcionar, verifique o console do navegador (F12) para ver erros

## Criar/Atualizar Admin

Se precisar criar ou atualizar o admin em produção:

1. No terminal local, certifique-se que o `.env` tem a `DATABASE_URL` do Neon:
   ```bash
   DATABASE_URL="postgresql://neondb_owner:npg_82yLYliJqpCj@ep-dawn-frog-agjjr2rn-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
   ```

2. Execute:
   ```bash
   npm run seed:admin
   ```

Isso criará/atualizará o admin no banco de dados Neon (produção).

## Verificar Conexão com o Banco

Para verificar se os usuários existem no banco Neon:

```bash
npx tsx -e "import { PrismaClient } from '@prisma/client'; const prisma = new PrismaClient(); prisma.user.findMany({ where: { role: 'ADMIN' }, select: { email: true, name: true, isActive: true } }).then(users => { console.log('Admins:', JSON.stringify(users, null, 2)); prisma.\$disconnect(); });"
```

## Troubleshooting

### Erro: "Email ou senha inválidos"
- Verifique se o email está correto: `admin@fintrak.app`
- Verifique se a senha está correta: `@Rosa1809`
- Execute `npm run seed:admin` para resetar a senha

### Erro: Redirecionamento infinito
- Verifique se `NEXTAUTH_URL=https://fintrak-omega.vercel.app` está configurado no Vercel
- Limpe os cookies do navegador
- Verifique se o middleware não está bloqueando o login

### Erro: Cookie não sendo criado
- Verifique se está usando `https://` (não `http://`)
- Verifique se `NEXTAUTH_URL=https://fintrak-omega.vercel.app` está configurado no Vercel
- Verifique se `NEXTAUTH_SECRET` está configurado no Vercel

## 🔗 URL do Site em Produção

**URL Base:** `https://fintrak-omega.vercel.app`

- Login: `https://fintrak-omega.vercel.app/login`
- Admin: `https://fintrak-omega.vercel.app/admin`
- Dashboard: `https://fintrak-omega.vercel.app/dashboard`
- Home: `https://fintrak-omega.vercel.app/home`

