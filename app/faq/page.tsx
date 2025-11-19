import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PublicHeader } from "@/components/public/PublicHeader"
import { PublicFooter } from "@/components/public/PublicFooter"
import { AIChatBot } from "@/components/public/AIChatBot"

export default function FAQPage() {
  const questions = [
    {
      key: "q1",
      question: "Preciso conectar meus apps de entrega diretamente?",
      answer: "Não, você insere manualmente suas receitas e despesas. Isso te dá controle total e privacidade sobre seus dados.",
    },
    {
      key: "q2",
      question: "Posso testar grátis?",
      answer: "Sim! O plano Grátis permite acompanhar 1 veículo e 1 plataforma. Não precisa de cartão de crédito.",
    },
    {
      key: "q3",
      question: "Posso cancelar a qualquer momento?",
      answer: "Absolutamente. Cancele sua assinatura a qualquer momento. Sem perguntas.",
    },
    {
      key: "q4",
      question: "E se eu uso mais de um app?",
      answer: "Perfeito! Acompanhe todas as suas plataformas de entrega em um só lugar. Compare ganhos e veja quais apps funcionam melhor para você.",
    },
    {
      key: "q5",
      question: "Como meus dados são armazenados e protegidos?",
      answer: "Seus dados são criptografados e armazenados com segurança. Nunca compartilhamos suas informações com terceiros.",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main className="flex-1">
      <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Perguntas Frequentes</h1>
      </div>

      <div className="max-w-3xl mx-auto space-y-4">
        {questions.map((item) => (
          <Card key={item.key}>
            <CardHeader>
              <CardTitle className="text-lg">{item.question}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{item.answer}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      </div>
      </main>
      <PublicFooter />
      <AIChatBot />
    </div>
  )
}

