# 🔑 Credenciais de Acesso Admin

## Credenciais Padrão

**Email:** `admin@motoboy.app`  
**Senha:** `Admin123!`

## Como Acessar

1. Acesse a aplicação em `http://localhost:3000`
2. Você será redirecionado para `/login`
3. Use as credenciais acima
4. Após o login, você será redirecionado automaticamente para `/admin`

## Resetar Senha do Admin

Se você precisar resetar a senha do admin, execute:

```bash
npx tsx scripts/reset-admin.ts
```

Isso irá resetar a senha para `Admin123!`

## Página de Setup

A página `/setup` só aparece quando **não existe nenhum admin** no sistema.

Para acessar diretamente (se necessário):
- URL: `http://localhost:3000/setup`
- Mas ela só funcionará se não houver admin cadastrado

## Criar Novo Admin

Se você quiser criar um novo admin, você pode:

1. **Via Setup (se não houver admin):**
   - Acesse `/setup`
   - Preencha o formulário
   - Crie a conta admin

2. **Via Painel Admin (se já estiver logado como admin):**
   - Acesse `/admin/partners`
   - Clique em "Novo Usuário"
   - Selecione role "ADMIN"
   - Crie o usuário

3. **Via Seed (apenas desenvolvimento):**
   - Execute `npm run db:seed`
   - Isso criará um admin com email `admin@example.com` e senha `Admin123!` (apenas se não existir admin)

## Problemas Comuns

### Não consigo fazer login
- Verifique se está usando o email correto: `admin@motoboy.app`
- Verifique se está usando a senha correta: `Admin123!`
- Certifique-se de que a conta está ativa (`isActive: true`)

### Não vejo a página de setup
- A página setup só aparece quando não existe admin
- Se já existe admin, você deve fazer login normalmente
- Para acessar diretamente: `http://localhost:3000/setup` (mas só funcionará se não houver admin)

### Redirecionado para login mesmo após login
- Limpe os cookies do navegador
- Verifique se `NEXTAUTH_SECRET` está configurado no `.env`
- Verifique se a sessão está sendo criada corretamente



