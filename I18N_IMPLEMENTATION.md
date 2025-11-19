# 🌍 Sistema de Internacionalização (i18n) e Regras Fiscais Globais

## Visão Geral

O aplicativo agora suporta:
- **Seleção de idioma** durante o registro
- **Regras fiscais para TODOS os países do mundo** (202 países)
- **Campo de idioma** no perfil do usuário

## Implementação

### 1. Campo de Idioma no Usuário

**Schema Prisma:**
```prisma
model User {
  language  String   @default("pt-BR") // ISO language code
  // ... outros campos
}
```

**Idiomas Suportados:**
- Português (Brasil) - `pt-BR`
- English (US) - `en-US`
- Español (España) - `es-ES`
- Español (México) - `es-MX`
- Français - `fr-FR`
- Deutsch - `de-DE`
- Italiano - `it-IT`
- Português (Portugal) - `pt-PT`
- Русский - `ru-RU`
- 中文 (简体) - `zh-CN`
- 日本語 - `ja-JP`
- 한국어 - `ko-KR`
- العربية - `ar-SA`
- हिन्दी - `hi-IN`
- E mais 6 idiomas...

### 2. Formulário de Registro

O formulário de registro agora inclui:
- **Seleção de Moeda** (BRL, USD, EUR, GBP)
- **Seleção de Idioma** (20 idiomas principais)

O idioma selecionado é salvo no perfil do usuário e pode ser usado para:
- Personalizar a interface do usuário
- Formatação de datas e números
- Mensagens e notificações

### 3. Regras Fiscais Globais

**Arquivo:** `lib/data/countries.ts`

**Total de Países:** 202 países com regras fiscais

**Estrutura:**
```typescript
interface CountryTaxRule {
  country: string      // ISO 3166-1 alpha-2 (ex: "BR", "US")
  displayName: string  // Nome do país em inglês
  percentage: number   // Taxa de imposto (0.15 = 15%)
}
```

**Regiões Cobertas:**
- ✅ América do Norte (3 países)
- ✅ América Central e Caribe (20 países)
- ✅ América do Sul (14 países)
- ✅ Europa Ocidental (17 países)
- ✅ Europa do Norte (8 países)
- ✅ Europa Central e Oriental (16 países)
- ✅ Europa Oriental (7 países)
- ✅ Ásia Ocidental / Oriente Médio (16 países)
- ✅ Ásia Central (7 países)
- ✅ Ásia do Sul (7 países)
- ✅ Ásia Oriental (7 países)
- ✅ Sudeste Asiático (11 países)
- ✅ África do Norte (7 países)
- ✅ África Ocidental (24 países)
- ✅ África Oriental (17 países)
- ✅ África do Sul (5 países)
- ✅ Oceania (16 países)

### 4. Seed de Dados

**Comando:**
```bash
npm run db:seed
```

**O que faz:**
1. Cria planos (Free, Pro, Premium)
2. Cria admin padrão (se não existir)
3. **Cria regras fiscais para TODOS os 202 países**

**Saída esperada:**
```
🌍 Criando regras fiscais para 202 países...
✅ Tax rules processadas: 189 criadas, 13 atualizadas
```

## Como Usar

### Selecionar Idioma no Registro

1. Acesse `/register`
2. Preencha os dados
3. Selecione o idioma preferido no campo "Idioma"
4. O idioma será salvo no perfil

### Visualizar Regras Fiscais

**No Admin Panel:**
- Acesse `/admin/tax-rules`
- Veja todas as regras fiscais de todos os países
- Filtre e pesquise por país

**No Dashboard do Usuário:**
- O sistema usa automaticamente a regra fiscal do país do usuário
- O cálculo de imposto estimado usa a taxa do país

## Estrutura de Arquivos

```
lib/
  ├── constants.ts          # Idiomas e moedas suportadas
  ├── data/
  │   └── countries.ts      # Lista completa de países e taxas
  └── validations/
      └── auth.ts           # Schema de validação (inclui language)

components/
  └── forms/
      └── RegisterForm.tsx  # Formulário com seleção de idioma

prisma/
  ├── schema.prisma         # Modelo User com campo language
  └── seed.ts              # Seed com todos os países
```

## Próximos Passos (Futuro)

Para implementar tradução completa da interface:

1. **Instalar next-intl:**
   ```bash
   npm install next-intl
   ```

2. **Criar arquivos de tradução:**
   ```
   messages/
     ├── pt-BR.json
     ├── en-US.json
     ├── es-ES.json
     └── ...
   ```

3. **Configurar next-intl no Next.js App Router**

4. **Usar traduções nos componentes:**
   ```tsx
   import { useTranslations } from 'next-intl'
   
   const t = useTranslations('common')
   return <h1>{t('welcome')}</h1>
   ```

## Notas Importantes

- **Taxas Fiscais:** As taxas são aproximadas e baseadas em médias para trabalhadores autônomos. Podem variar por região, faixa de renda e legislação local.
- **Idiomas:** Atualmente, 20 idiomas principais estão disponíveis. Para adicionar mais, edite `lib/constants.ts`.
- **Países:** Todos os 202 países reconhecidos pela ONU estão incluídos com regras fiscais.

## Manutenção

### Adicionar Novo Idioma

1. Edite `lib/constants.ts`
2. Adicione o idioma em `SUPPORTED_LANGUAGES`:
   ```typescript
   { code: "xx-XX", name: "Language Name", nativeName: "Native Name" }
   ```

### Atualizar Taxa Fiscal

1. Edite `lib/data/countries.ts`
2. Atualize a taxa do país desejado
3. Execute `npm run db:seed` para atualizar o banco

### Adicionar Novo País

1. Edite `lib/data/countries.ts`
2. Adicione o país na região apropriada:
   ```typescript
   { country: "XX", displayName: "Country Name", percentage: 0.20 }
   ```
3. Execute `npm run db:seed`



