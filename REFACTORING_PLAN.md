# 🔧 Plano de Refatoração - Code Review

## 📋 Problemas Identificados

### 🔴 Críticos

1. **TypeScript `any` types** (26 ocorrências)
   - Formulários usando `data: any` em onSubmit
   - Services usando `where: any` para queries Prisma
   - APIs usando `error: any` em catch blocks

2. **Tipos duplicados**
   - `Platform`, `Income`, `Expense` definidos em múltiplos arquivos
   - Tipos locais que deveriam estar em `types/index.ts`

3. **Lógica duplicada**
   - Formatação de moeda repetida em vários componentes
   - Lógica de fetch/error handling duplicada
   - Formatação de datas duplicada

### 🟡 Importantes

4. **Console.log/error** (54 ocorrências)
   - Deveria usar um logger centralizado
   - Sem níveis de log apropriados

5. **Error handling inconsistente**
   - Padrões diferentes de tratamento de erros
   - Mensagens de erro genéricas

6. **Separação de concerns**
   - Lógica de negócio em componentes
   - Fetch direto em componentes (deveria usar hooks/services)

### 🟢 Melhorias

7. **Código repetitivo em formulários**
   - Estrutura similar em todos os forms
   - Poderia ter um componente base

8. **Queries Prisma sem tipos**
   - `where: any` deveria usar tipos do Prisma
   - Falta type safety

9. **Validação de resposta API**
   - Não valida estrutura de resposta
   - Pode causar erros em runtime

## 🎯 Plano de Refatoração

### Fase 1: Tipos e Type Safety
- [ ] Centralizar tipos em `types/index.ts`
- [ ] Remover todos os `any` types
- [ ] Criar tipos para Prisma queries
- [ ] Tipar corretamente formulários

### Fase 2: Utilitários e Helpers
- [ ] Criar logger centralizado
- [ ] Extrair formatação de moeda
- [ ] Extrair formatação de datas
- [ ] Criar helpers para fetch/API calls

### Fase 3: Hooks e Services
- [ ] Criar hooks customizados para CRUD
- [ ] Extrair lógica de fetch para hooks
- [ ] Criar service layer para API calls

### Fase 4: Componentes
- [ ] Criar componente base para formulários
- [ ] Extrair lógica de listagem
- [ ] Melhorar separação de concerns

### Fase 5: Error Handling
- [ ] Padronizar tratamento de erros
- [ ] Criar tipos de erro customizados
- [ ] Melhorar mensagens de erro

## 📝 Ordem de Implementação

1. **Tipos centralizados** (mais crítico)
2. **Logger e utilitários** (base para outras melhorias)
3. **Hooks customizados** (reduz duplicação)
4. **Tipos Prisma** (type safety)
5. **Componentes base** (reutilização)
6. **Error handling** (consistência)



