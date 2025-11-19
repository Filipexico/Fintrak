import { NextRequest, NextResponse } from "next/server"

const FAQ_CONTEXT = `Você é um assistente virtual do Fintrak, um sistema de controle financeiro para entregadores.

INFORMAÇÕES SOBRE O FINTRAK:
- Fintrak é um sistema completo para entregadores gerenciarem suas finanças
- Permite acompanhar receitas de múltiplos apps (Uber Eats, iFood, Wolt, 99Food, Rappi, etc.)
- Registro de despesas por categoria (combustível, manutenção, seguro, celular, alimentação, etc.)
- Acompanhamento de veículos e distância percorrida
- Cálculo automático de lucro líquido e estimativas de impostos
- Relatórios em PDF e Excel
- Planos disponíveis: Grátis (1 veículo, 1 plataforma), Plus (2 veículos, 2 plataformas - 3€/mês), Premium (ilimitado - 5€/mês)

PERGUNTAS FREQUENTES:
1. "Preciso conectar meus apps de entrega diretamente?" - Não, você insere manualmente suas receitas e despesas. Isso te dá controle total e privacidade sobre seus dados.
2. "Posso testar grátis?" - Sim! O plano Grátis permite acompanhar 1 veículo e 1 plataforma. Não precisa de cartão de crédito.
3. "Posso cancelar a qualquer momento?" - Absolutamente. Cancele sua assinatura a qualquer momento. Sem perguntas.
4. "E se eu uso mais de um app?" - Perfeito! Acompanhe todas as suas plataformas de entrega em um só lugar. Compare ganhos e veja quais apps funcionam melhor para você.
5. "Como meus dados são armazenados e protegidos?" - Seus dados são criptografados e armazenados com segurança. Nunca compartilhamos suas informações com terceiros.

Responda de forma amigável, clara e objetiva, sempre em português brasileiro. Se não souber algo específico sobre o Fintrak, seja honesto e sugira que o usuário consulte a página de FAQ ou entre em contato com o suporte.`

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { messages } = body

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Mensagens inválidas" }, { status: 400 })
    }

    const openaiApiKey = process.env.OPENAI_API_KEY

    if (!openaiApiKey) {
      // Fallback para resposta sem AI se a chave não estiver configurada
      const lastMessage = messages[messages.length - 1]?.content || ""
      const lowerMessage = lastMessage.toLowerCase()

      // Respostas simples baseadas em palavras-chave
      let response = "Obrigado pela sua pergunta! "

      if (lowerMessage.includes("grátis") || lowerMessage.includes("gratis") || lowerMessage.includes("testar")) {
        response +=
          "Sim! Você pode testar o Fintrak grátis. O plano Grátis permite acompanhar 1 veículo e 1 plataforma de entrega. Não precisa de cartão de crédito para começar."
      } else if (lowerMessage.includes("preço") || lowerMessage.includes("preco") || lowerMessage.includes("custo") || lowerMessage.includes("valor")) {
        response +=
          "Temos três planos: Grátis (1 veículo, 1 plataforma), Plus (3€/mês - 2 veículos, 2 plataformas) e Premium (5€/mês - ilimitado). Confira nossa página de preços para mais detalhes!"
      } else if (lowerMessage.includes("app") || lowerMessage.includes("plataforma")) {
        response +=
          "Você pode acompanhar receitas de múltiplos apps como Uber Eats, iFood, Wolt, 99Food, Rappi e outros. Todos em um único painel!"
      } else if (lowerMessage.includes("dados") || lowerMessage.includes("segurança") || lowerMessage.includes("seguranca") || lowerMessage.includes("privacidade")) {
        response +=
          "Seus dados são criptografados e armazenados com segurança. Nunca compartilhamos suas informações com terceiros. Você tem controle total sobre seus dados."
      } else if (lowerMessage.includes("cancelar") || lowerMessage.includes("cancelamento")) {
        response +=
          "Você pode cancelar sua assinatura a qualquer momento, sem perguntas. Não há taxa de cancelamento."
      } else {
        response +=
          "Para mais informações, consulte nossa página de FAQ ou entre em contato com nosso suporte. Posso ajudar com informações sobre planos, funcionalidades e como começar!"
      }

      return NextResponse.json({ message: response })
    }

    // Usar OpenAI API
    const systemMessage = {
      role: "system",
      content: FAQ_CONTEXT,
    }

    const apiMessages = [systemMessage, ...messages]

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: apiMessages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("OpenAI API error:", errorData)
      throw new Error("Erro ao processar resposta da AI")
    }

    const data = await response.json()
    const aiMessage = data.choices?.[0]?.message?.content || "Desculpe, não consegui processar sua mensagem."

    return NextResponse.json({ message: aiMessage })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json(
      { error: "Erro ao processar mensagem. Tente novamente." },
      { status: 500 }
    )
  }
}

export const dynamic = "force-dynamic"


