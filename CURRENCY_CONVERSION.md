# 💶 Sistema de Conversão de Moedas para EUR

## Visão Geral

O dashboard administrativo agora converte **todos os valores monetários para EUR (Euro)**, independentemente da moeda original do pagamento.

## Como Funciona

### 1. API de Conversão

- **Fonte**: ExchangeRate-API (gratuita, sem necessidade de chave)
- **URL**: `https://api.exchangerate-api.com/v4/latest/USD`
- **Cache**: Taxas são cacheadas por 1 hora para melhor performance
- **Fallback**: Se a API falhar, usa taxas fixas aproximadas

### 2. Conversão Automática

Todos os valores são convertidos para EUR usando a taxa de câmbio do dia:

- **Pagamentos**: Cada pagamento é convertido usando sua moeda original
- **MRR**: Assinaturas são convertidas baseadas na moeda do usuário
- **Receitas Mensais**: Agregadas e convertidas para EUR
- **Top 5 Dias**: Receitas convertidas antes de ordenar

### 3. Exibição

- Todos os valores no dashboard são exibidos em **EUR (€)**
- Formatação: `€ 1.234,56` (formato português/europeu)
- Indicador visual: "💶 Todos os valores exibidos em EUR (Euro)" no topo do dashboard

## Taxas de Câmbio

### Taxas em Tempo Real
- Buscadas automaticamente da API
- Atualizadas a cada 1 hora (cache)
- Suporta: BRL, USD, EUR, GBP e outras moedas principais

### Taxas de Fallback (se API falhar)
- **EUR**: 1.00 (base)
- **BRL**: 0.18 (1 EUR ≈ 5.5 BRL)
- **USD**: 0.92 (1 EUR ≈ 1.09 USD)
- **GBP**: 1.17 (1 EUR ≈ 0.85 GBP)

## Arquivos Modificados

### Novos Arquivos
- `lib/utils/currency.ts` - Utilitários de conversão de moedas

### Arquivos Atualizados
- `app/api/admin/business/route.ts` - Conversão de todos os valores para EUR
- `components/admin/BusinessDashboard.tsx` - Exibição em EUR

## Funções Principais

### `convertToEUR(amount, fromCurrency)`
Converte um valor de uma moeda para EUR.

### `convertMultipleToEUR(amounts[])`
Converte múltiplos valores (com diferentes moedas) para EUR e retorna a soma.

### `formatEUR(amount)`
Formata um valor em EUR com o símbolo € e formatação europeia.

### `getExchangeRate(fromCurrency, toCurrency)`
Obtém a taxa de câmbio atual entre duas moedas.

## Exemplo de Uso

```typescript
import { convertToEUR, formatEUR } from "@/lib/utils/currency"

// Converter R$ 100 para EUR
const amountEUR = await convertToEUR(100, "BRL")
console.log(formatEUR(amountEUR)) // € 18,00 (aproximadamente)

// Converter múltiplos valores
const amounts = [
  { amount: 100, currency: "BRL" },
  { amount: 50, currency: "USD" },
  { amount: 30, currency: "EUR" },
]
const totalEUR = await convertMultipleToEUR(amounts)
console.log(formatEUR(totalEUR))
```

## Notas Importantes

1. **Taxas de Câmbio**: As taxas são atualizadas automaticamente, mas podem variar durante o dia
2. **Cache**: Taxas são cacheadas por 1 hora para melhor performance
3. **Precisão**: Valores são arredondados para 2 casas decimais
4. **Fallback**: Se a API falhar, usa taxas fixas (podem não estar 100% atualizadas)
5. **Performance**: Conversões são feitas em lote quando possível para otimizar

## Melhorias Futuras

- [ ] Armazenar taxas históricas para conversão baseada na data do pagamento
- [ ] Permitir escolher moeda base (não apenas EUR)
- [ ] Integrar com múltiplas APIs de câmbio para maior confiabilidade
- [ ] Adicionar indicador de última atualização das taxas



