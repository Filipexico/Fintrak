import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Check } from "lucide-react"
import { PublicHeader } from "@/components/public/PublicHeader"
import { PublicFooter } from "@/components/public/PublicFooter"
import { AIChatBot } from "@/components/public/AIChatBot"

export default function PricingPage() {
  const plans = [
    {
      key: "free",
      name: "Grátis",
      price: "0",
      period: "/mês",
      description: "Perfeito para começar",
      badge: null,
      features: [
        "1 veículo",
        "1 plataforma de entrega",
        "Acompanhamento de receitas e despesas",
        "Painel básico",
        "Relatórios básicos",
      ],
      cta: "Começar Grátis",
      planId: "free",
    },
    {
      key: "plus",
      name: "Plus",
      price: "3",
      period: "/mês",
      description: "Para entregadores sérios",
      badge: "Popular",
      features: [
        "2 veículos",
        "2 plataformas de entrega",
        "Todas as funcionalidades Grátis",
        "Relatórios e gráficos aprimorados",
        "Análises mensais detalhadas",
      ],
      cta: "Entre em contato",
      planId: "plus",
      requiresContact: true,
    },
    {
      key: "premium",
      name: "Premium",
      price: "5",
      period: "/mês",
      description: "Para profissionais",
      badge: "Mais Popular",
      features: [
        "Veículos ilimitados",
        "Plataformas ilimitadas",
        "Todas as funcionalidades Plus",
        "Análises avançadas completas",
        "Suporte prioritário",
      ],
      cta: "Escolher Premium",
      planId: "premium",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main className="flex-1">
      <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Preços simples e transparentes</h1>
        <p className="text-xl text-muted-foreground">Escolha o plano que atende suas necessidades</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <Card
            key={plan.key}
            className={plan.badge === "Mais Popular" ? "border-primary border-2" : ""}
          >
            <CardHeader>
              {plan.badge && (
                <div className="mb-2">
                  <span className="inline-block bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded">
                    {plan.badge}
                  </span>
                </div>
              )}
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4">
                {plan.requiresContact ? (
                  <p className="text-lg font-medium text-primary">Entre em contato com o suporte</p>
                ) : (
                  <>
                    <span className="text-4xl font-bold">{plan.price}€</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href={plan.requiresContact ? "/contact?plan=plus" : `/signup?plan=${plan.planId}`} className="block">
                <Button
                  className="w-full"
                  variant={plan.badge === "Mais Popular" ? "default" : "outline"}
                >
                  {plan.cta}
                </Button>
              </Link>
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

