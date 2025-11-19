import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DollarSign, TrendingUp, BarChart3, Zap, Shield, Smartphone, Clock, Users, Award, TrendingDown } from "lucide-react"
import { PublicHeader } from "@/components/public/PublicHeader"
import { PublicFooter } from "@/components/public/PublicFooter"
import { AIChatBot } from "@/components/public/AIChatBot"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main className="flex-1">
      <div className="flex flex-col">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center bg-gradient-to-b from-primary/5 to-background">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
          Saiba exatamente quanto você realmente ganha como entregador
        </h1>
        <p className="text-xl text-muted-foreground mb-4 max-w-3xl mx-auto">
          Acompanhe receitas, despesas, uso de veículos e calcule seu lucro real e estimativas de impostos. Tenha controle total das suas finanças de entregas.
        </p>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Pare de trabalhar às cegas. Descubra qual app paga melhor, quanto você gasta com combustível e manutenção, e finalmente veja seu lucro real.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/signup">
            <Button size="lg" className="text-lg px-8 py-6 bg-primary hover:bg-primary/90">Começar Grátis Agora</Button>
          </Link>
          <Link href="/pricing">
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              Ver Planos e Preços
            </Button>
          </Link>
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          ✓ Sem cartão de crédito ✓ Cadastro em menos de 2 minutos ✓ Teste grátis para sempre
        </p>
      </section>

      {/* Problem Section */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">
            Você já passou por isso?
          </h2>
          <p className="text-lg text-muted-foreground text-center mb-12 max-w-3xl mx-auto">
            A maioria dos entregadores não sabe quanto realmente ganha porque não controla os custos reais do trabalho
          </p>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="border-red-200 bg-red-50/50">
              <CardContent className="p-6 text-center">
                <TrendingDown className="h-12 w-12 mb-4 text-red-600 mx-auto" />
                <h3 className="text-lg font-semibold mb-2 text-red-900">Trabalho muito, mas não sei quanto ganho</h3>
                <p className="text-sm text-red-800">
                  Você trabalha o dia todo, recebe vários pagamentos, mas no final do mês não sabe se realmente lucrou ou perdeu dinheiro.
                </p>
              </CardContent>
            </Card>
            <Card className="border-yellow-200 bg-yellow-50/50">
              <CardContent className="p-6 text-center">
                <DollarSign className="h-12 w-12 mb-4 text-yellow-600 mx-auto" />
                <h3 className="text-lg font-semibold mb-2 text-yellow-900">Os custos "comem" meu ganho</h3>
                <p className="text-sm text-yellow-800">
                  Combustível, manutenção, pneus, seguro... Você sabe que gasta, mas não sabe exatamente quanto e como isso afeta seu lucro.
                </p>
              </CardContent>
            </Card>
            <Card className="border-blue-200 bg-blue-50/50">
              <CardContent className="p-6 text-center">
                <Smartphone className="h-12 w-12 mb-4 text-blue-600 mx-auto" />
                <h3 className="text-lg font-semibold mb-2 text-blue-900">Não sei qual app vale mais a pena</h3>
                <p className="text-sm text-blue-800">
                  Você trabalha em vários apps ao mesmo tempo, mas não consegue comparar qual deles realmente paga melhor após os custos.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            A solução que você precisa
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Fintrak foi feito especificamente para entregadores que querem ter controle financeiro real sobre seu trabalho
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="bg-primary/10 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <DollarSign className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Acompanhe todos os seus apps em um só lugar
              </h3>
              <p className="text-muted-foreground mb-4">
                Uber Eats, iFood, Wolt, 99Food, Rappi, Loggi... Gerencie todas as suas plataformas de entrega em um único painel. Veja quanto você ganha em cada uma delas.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>✓ Receitas por app</li>
                <li>✓ Histórico completo</li>
                <li>✓ Comparação de ganhos</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="bg-primary/10 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Controle total dos seus custos
              </h3>
              <p className="text-muted-foreground mb-4">
                Acompanhe combustível, manutenção preventiva e corretiva, seguro, conta do celular, alimentação e todas as despesas relacionadas ao seu trabalho.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>✓ Categorias de despesas</li>
                <li>✓ Histórico de gastos</li>
                <li>✓ Alertas de manutenção</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="bg-primary/10 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <BarChart3 className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Entenda seu lucro real
              </h3>
              <p className="text-muted-foreground mb-4">
                Veja seus ganhos reais após todas as despesas e estimativas de impostos. Pare de adivinhar e saiba exatamente quanto você lucra por dia, semana e mês.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>✓ Lucro líquido calculado</li>
                <li>✓ Estimativas de impostos</li>
                <li>✓ Gráficos e relatórios</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="bg-primary/10 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <Zap className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Compare e otimize
              </h3>
              <p className="text-muted-foreground mb-4">
                Compare dias, semanas, meses e plataformas para ver o que realmente funciona. Descubra qual app paga melhor e em quais horários vale mais a pena trabalhar.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>✓ Análises comparativas</li>
                <li>✓ Identificação de padrões</li>
                <li>✓ Decisões baseadas em dados</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Vehicle Tracking Section */}
      <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Acompanhe seu veículo como nunca antes
            </h2>
            <p className="text-xl text-muted-foreground">
              Registre distâncias, consumo de combustível ou energia, e tenha controle total sobre o uso do seu veículo
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="bg-white">
              <CardContent className="p-6 text-center">
                <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Distância Diária</h3>
                <p className="text-muted-foreground text-sm">
                  Registre quantos quilômetros você roda por dia. Use GPS para captura automática ou insira manualmente.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white">
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Eficiência do Veículo</h3>
                <p className="text-muted-foreground text-sm">
                  Calcule automaticamente quantos km/L ou km/kWh seu veículo faz. Monitore a eficiência ao longo do tempo.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white">
              <CardContent className="p-6 text-center">
                <Award className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Histórico de Manutenções</h3>
                <p className="text-muted-foreground text-sm">
                  Registre todas as manutenções do seu veículo. Receba alertas quando estiver na hora de revisar.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Audience Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Perfeito para você que trabalha com entregas</h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Fintrak foi pensado para todos os tipos de entregadores, independente de como você trabalha
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <Users className="h-10 w-10 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Motoboys em tempo integral</h3>
            <p className="text-sm text-muted-foreground">
              Se você trabalha o dia todo fazendo entregas, precisa saber se está realmente lucrando com seu esforço.
            </p>
          </Card>
          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <Clock className="h-10 w-10 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Entregadores em tempo parcial</h3>
            <p className="text-sm text-muted-foreground">
              Trabalha algumas horas por dia? Veja quanto você realmente ganha por hora trabalhada.
            </p>
          </Card>
          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <Smartphone className="h-10 w-10 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Quem usa vários apps</h3>
            <p className="text-sm text-muted-foreground">
              Trabalha com múltiplas plataformas? Descubra qual app vale mais a pena para você.
            </p>
          </Card>
          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <Award className="h-10 w-10 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Todos os tipos de veículo</h3>
            <p className="text-sm text-muted-foreground">
              Moto, bicicleta, carro ou elétrico - acompanhe o uso e os custos do seu veículo.
            </p>
          </Card>
        </div>
      </section>

      {/* Security & Privacy Section */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Shield className="h-16 w-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">Seus dados estão seguros</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Seus dados financeiros são criptografados e armazenados com segurança. Você tem controle total sobre suas informações. Nunca compartilhamos seus dados com terceiros.
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div>
                <h3 className="font-semibold mb-2">✓ Criptografia</h3>
                <p className="text-sm text-muted-foreground">Todas as informações são protegidas</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">✓ Privacidade</h3>
                <p className="text-sm text-muted-foreground">Você controla seus próprios dados</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">✓ Sem compartilhamento</h3>
                <p className="text-sm text-muted-foreground">Nunca vendemos suas informações</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Como funciona</h2>
          <p className="text-xl text-muted-foreground">
            Simples, rápido e eficiente. Comece a usar em menos de 2 minutos
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Crie sua conta grátis</h3>
            <p className="text-muted-foreground">
              Cadastre-se em menos de 2 minutos. Não precisa de cartão de crédito. Escolha o plano que melhor se adapta às suas necessidades.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Registre suas entregas e custos</h3>
            <p className="text-muted-foreground">
              Adicione suas receitas de cada app e suas despesas. É simples e rápido - você pode fazer pelo celular ou computador.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Veja seu lucro real</h3>
            <p className="text-muted-foreground">
              O dashboard mostra automaticamente quanto você realmente ganha, compara apps e períodos, e te ajuda a tomar decisões melhores.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Pronto para ter controle das suas finanças?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Comece hoje mesmo. Sem compromisso. Sem cartão de crédito. Teste grátis e descubra quanto você realmente ganha.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6 bg-white text-primary hover:bg-white/90">
                Começar Grátis Agora
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6 bg-white text-primary hover:bg-white/90">
                Ver Planos
              </Button>
            </Link>
          </div>
          <p className="text-sm mt-6 opacity-75">
            ✓ Teste gratuito sem limites ✓ Sem cartão de crédito ✓ Cancele quando quiser
          </p>
        </div>
      </section>
      </div>
      </main>
      <PublicFooter />
      <AIChatBot />
    </div>
  )
}
