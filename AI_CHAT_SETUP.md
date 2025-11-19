# 🤖 Chat com AI - Configuração

## 📋 Resumo

Foi implementado um chat com AI para responder dúvidas frequentes sobre o Fintrak. O chat aparece como um botão flutuante em todas as páginas públicas do site.

## 🚀 Funcionalidades

- **Botão flutuante**: Botão fixo no canto inferior direito de todas as páginas públicas
- **Chat em tempo real**: Interface de chat responsiva e intuitiva
- **IA integrada**: Usa OpenAI GPT-3.5-turbo para responder perguntas (ou fallback simples se não configurado)
- **Contexto específico**: A IA é treinada com informações sobre o Fintrak, planos, funcionalidades e FAQ

## 🔧 Configuração

### 1. Variável de Ambiente

Adicione a chave da API OpenAI no arquivo `.env`:

```env
OPENAI_API_KEY=sua-chave-openai-aqui
```

**Opcional**: Se não configurar a chave, o chat funcionará com respostas simples baseadas em palavras-chave.

### 2. Obter Chave da OpenAI

1. Acesse [OpenAI Platform](https://platform.openai.com/)
2. Crie uma conta ou faça login
3. Vá em **API Keys**
4. Crie uma nova chave
5. Copie e adicione no `.env`

### 3. Páginas com Chat

O chat foi adicionado nas seguintes páginas públicas:
- `/home` - Página inicial
- `/features` - Funcionalidades
- `/pricing` - Preços
- `/faq` - Perguntas frequentes
- `/signup` - Cadastro

## 📝 Arquivos Criados

1. **`components/public/AIChatBot.tsx`**
   - Componente do chat flutuante
   - Interface de mensagens
   - Gerenciamento de estado

2. **`app/api/chat/route.ts`**
   - API route para processar mensagens
   - Integração com OpenAI API
   - Fallback para respostas simples

## 🎨 Características do Chat

- **Design**: Interface moderna com cores do tema (laranja/primary)
- **Responsivo**: Funciona bem em desktop e mobile
- **Acessível**: Ícones e labels descritivos
- **Performance**: Carregamento otimizado com `priority` na logo

## 🔒 Segurança

- A chave da API nunca é exposta no frontend
- Todas as requisições passam pelo backend
- Rate limiting recomendado para produção (implementar conforme necessário)

## 💡 Personalização

### Alterar o Contexto da IA

Edite a constante `FAQ_CONTEXT` em:
- `app/api/chat/route.ts` (backend)
- `components/public/AIChatBot.tsx` (não usado, mas mantido para referência)

### Alterar o Modelo da OpenAI

No arquivo `app/api/chat/route.ts`, altere o campo `model`:

```typescript
model: "gpt-3.5-turbo", // ou "gpt-4", "gpt-4-turbo", etc.
```

### Usar Outro Provedor de IA

Substitua a chamada à API OpenAI em `app/api/chat/route.ts` pela API do seu provedor preferido (Google Gemini, Anthropic Claude, etc.).

## 📊 Custos

**Importante**: O uso da OpenAI API pode gerar custos. Considere:

- **GPT-3.5-turbo**: ~$0.0015 por 1K tokens (muito econômico)
- **GPT-4**: ~$0.03 por 1K tokens (mais caro, mas melhor qualidade)
- Configurar limites de uso em produção
- Monitorar uso na dashboard da OpenAI

## ✅ Próximos Passos (Opcional)

- [ ] Adicionar histórico de conversas (localStorage)
- [ ] Implementar rate limiting
- [ ] Adicionar métricas de uso
- [ ] Suporte a múltiplos idiomas
- [ ] Integração com sistema de tickets se necessário

