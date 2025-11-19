# 📧 Configuração de Email - Fintrak

## 📋 Resumo

O sistema Fintrak possui funcionalidades de envio de email para:
1. **Formulário de contato**: Emails enviados quando usuários preenchem o formulário de contato
2. **Registro com plano pago**: Email enviado quando um usuário se registra com plano Premium (pago)
3. **Pagamentos**: Email enviado quando um pagamento é registrado no sistema

## 🔧 Configuração

### Variáveis de Ambiente

Adicione as seguintes variáveis no arquivo `.env`:

```env
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASS=sua-senha-de-app
SMTP_FROM=noreply@fintrak.com
```

### Exemplo: Gmail

Para usar Gmail como provedor de email:

1. **Ative a verificação em duas etapas** na sua conta Google
2. **Gere uma senha de app**:
   - Acesse: https://myaccount.google.com/apppasswords
   - Selecione "App" → "Email" e "Dispositivo" → "Outro (nome personalizado)"
   - Digite "Fintrak" e gere a senha
   - Use esta senha no `SMTP_PASS`

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASS=xxxx xxxx xxxx xxxx
SMTP_FROM=noreply@fintrak.com
```

### Outros Provedores

#### SendGrid
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=sua-api-key-do-sendgrid
SMTP_FROM=noreply@fintrak.com
```

#### Mailgun
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@seu-dominio.mailgun.org
SMTP_PASS=sua-senha-mailgun
SMTP_FROM=noreply@fintrak.com
```

#### Outlook/Office 365
```env
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_USER=seu-email@outlook.com
SMTP_PASS=sua-senha
SMTP_FROM=noreply@fintrak.com
```

## 📨 Emails Enviados

### 1. Formulário de Contato (`/contact`)

**Destinatário**: `filipe@filipefrancisco.com`  
**Assunto**: `Fintrak - {Assunto ou "Contato"}`

**Conteúdo**:
- Nome do usuário
- Email do usuário
- Plano de interesse (se aplicável)
- Assunto
- Mensagem completa

### 2. Registro com Plano Pago

**Destinatário**: `filipe@filipefrancisco.com`  
**Assunto**: `Fintrak - Nova aquisição de plano pago`

**Conteúdo**:
- Informações do cliente (nome, email, país, moeda)
- Plano adquirido (nome, display name, valor)
- Data e hora do registro

**Quando é enviado**: Apenas quando o usuário se registra com plano Premium (5€/mês). Planos Grátis e Plus não geram email de aquisição.

### 3. Pagamento Registrado

**Destinatário**: `filipe@filipefrancisco.com`  
**Assunto**: `Fintrak - Novo pagamento registrado`

**Conteúdo**:
- Informações do cliente (nome, email)
- Detalhes do pagamento (valor, moeda, método, status, data)
- Plano associado (se houver)
- Descrição adicional (se houver)

**Quando é enviado**: Sempre que um pagamento é criado através do painel admin (`/api/admin/payments` POST).

## ⚠️ Fallback Sem Configuração

Se as variáveis SMTP não estiverem configuradas:
- Os emails **não serão enviados**, mas o sistema continuará funcionando normalmente
- Os logs mostrarão mensagens de aviso indicando que o SMTP não está configurado
- Os formulários e registros funcionarão normalmente, apenas sem envio de email

## 🔒 Segurança

- **Nunca** commite o arquivo `.env` no repositório
- Use senhas de app ou API keys ao invés de senhas principais
- Em produção, configure as variáveis de ambiente na plataforma de deploy (Vercel, Railway, etc.)

## ✅ Testando

Para testar se o email está funcionando:

1. Configure as variáveis SMTP no `.env`
2. Preencha o formulário de contato em `/contact`
3. Verifique se o email chegou em `filipe@filipefrancisco.com`
4. Verifique os logs do servidor para mensagens de sucesso ou erro

## 📝 Logs

Os logs de envio de email aparecerão no console do servidor:
- ✅ Sucesso: `Email enviado com sucesso`
- ⚠️ Aviso: `Email não enviado (SMTP não configurado)`
- ❌ Erro: `Erro ao enviar email`

