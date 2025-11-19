"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MessageCircle, X, Send, Bot, User, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

const FAQ_CONTEXT = `
Você é um assistente virtual do Fintrak, um sistema de controle financeiro para entregadores.

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

Responda de forma amigável, clara e objetiva, sempre em português brasileiro. Se não souber algo específico sobre o Fintrak, seja honesto e sugira que o usuário consulte a página de FAQ ou entre em contato com o suporte.
`

export function AIChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Olá! 👋 Sou o assistente virtual do Fintrak. Como posso te ajudar hoje?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      if (!response.ok) {
        throw new Error("Erro ao obter resposta")
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message || "Desculpe, não consegui processar sua mensagem.",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente ou consulte nossa página de FAQ.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all hover:scale-110 hover:shadow-xl",
          isOpen && "hidden"
        )}
        aria-label="Abrir chat"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 z-50 h-[600px] w-[400px] flex flex-col shadow-2xl">
          <CardContent className="flex flex-col h-full p-0">
            {/* Header */}
            <div className="flex items-center justify-between border-b bg-primary text-primary-foreground p-4 rounded-t-lg">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                <h3 className="font-semibold">Assistente Fintrak</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:opacity-80 transition-opacity"
                aria-label="Fechar chat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-2",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {message.role === "assistant" && (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground flex-shrink-0">
                      <Bot className="h-4 w-4" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[80%] rounded-lg px-4 py-2",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-background border"
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                  {message.role === "user" && (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted flex-shrink-0">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-2 justify-start">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground flex-shrink-0">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="bg-background border rounded-lg px-4 py-2">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t p-4 bg-background rounded-b-lg">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  size="sm"
                  className="bg-primary hover:bg-primary/90"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}


