import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { DollarSign, Receipt, Car, BarChart3, Calculator, Smartphone, Shield, Download, TrendingUp, Clock, Target, PieChart } from "lucide-react"
import { PublicHeader } from "@/components/public/PublicHeader"
import { PublicFooter } from "@/components/public/PublicFooter"
import { AIChatBot } from "@/components/public/AIChatBot"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function FeaturesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main className="flex-1">
      <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Funcionalidades completas para gerenciar seu negócio de entregas</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Fintrak oferece todas as ferramentas que você precisa para ter controle total sobre suas finanças, veículos e desempenho como entregador.
        </p>
      </div>

      {/* Financial Tracking */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-primary/10 p-3 rounded-lg">
            <DollarSign className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h2 className="text-3xl font-bold">Acompanhamento Financeiro Completo</h2>
            <p className="text-muted-foreground">Controle todas suas receitas de forma organizada e eficiente</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Receitas por Plataforma</CardTitle>
              <CardDescription>Gerencie ganhos de múltiplos apps</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li>✓ Registre receitas de cada app separadamente (Uber Eats, iFood, Wolt, 99Food, Rappi, etc.)</li>
                <li>✓ Acompanhe ganhos por dia, semana e mês</li>
                <li>✓ Compare qual app paga melhor para você</li>
                <li>✓ Histórico completo de todas as suas receitas</li>
                <li>✓ Suporte para clientes particulares além dos apps</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Visualização e Relatórios</CardTitle>
              <CardDescription>Veja seus dados de forma clara e objetiva</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li>✓ Gráficos de receitas por plataforma</li>
                <li>✓ Análise mensal e anual</li>
                <li>✓ Comparação de períodos</li>
                <li>✓ Exportação de relatórios em PDF e Excel</li>
                <li>✓ Dashboards interativos e fáceis de entender</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Expense Management */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-primary/10 p-3 rounded-lg">
            <Receipt className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h2 className="text-3xl font-bold">Gestão Inteligente de Despesas</h2>
            <p className="text-muted-foreground">Saiba exatamente para onde vai cada centavo</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Categorias de Despesas</CardTitle>
              <CardDescription>Organize seus custos por categoria</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li>✓ Combustível (gasolina, álcool, diesel, GNV)</li>
                <li>✓ Energia elétrica (para veículos elétricos)</li>
                <li>✓ Manutenção preventiva e corretiva</li>
                <li>✓ Seguro do veículo</li>
                <li>✓ Plano de celular e internet</li>
                <li>✓ Alimentação durante o trabalho</li>
                <li>✓ Outras despesas relacionadas</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Análise de Custos</CardTitle>
              <CardDescription>Entenda seus padrões de gasto</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li>✓ Gráficos de despesas por categoria</li>
                <li>✓ Identificação dos maiores custos</li>
                <li>✓ Tendências de gastos ao longo do tempo</li>
                <li>✓ Alertas quando os custos aumentam</li>
                <li>✓ Planejamento de gastos futuros</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Vehicle Tracking */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-primary/10 p-3 rounded-lg">
            <Car className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h2 className="text-3xl font-bold">Acompanhamento de Veículos e Distância</h2>
            <p className="text-muted-foreground">Monitore o uso e desempenho do seu veículo</p>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Registro de Distância</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li>✓ Registre quilômetros por dia</li>
                <li>✓ Use GPS para captura automática</li>
                <li>✓ Histórico completo de distâncias</li>
                <li>✓ Gráficos de uso diário e semanal</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Consumo e Eficiência</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li>✓ Acompanhe consumo de combustível (L)</li>
                <li>✓ Acompanhe consumo de energia (kWh) para veículos elétricos</li>
                <li>✓ Cálculo automático de km/L ou km/kWh</li>
                <li>✓ Identifique queda de eficiência</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Manutenções</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li>✓ Registre todas as manutenções</li>
                <li>✓ Alertas de revisão periódica</li>
                <li>✓ Controle de custos de manutenção</li>
                <li>✓ Histórico completo por veículo</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Reports and Analytics */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-primary/10 p-3 rounded-lg">
            <BarChart3 className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h2 className="text-3xl font-bold">Relatórios e Análises Avançadas</h2>
            <p className="text-muted-foreground">Tome decisões baseadas em dados reais</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <PieChart className="h-10 w-10 mb-2 text-primary" />
              <CardTitle>Relatórios Financeiros</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3">
                Relatórios detalhados de receitas, despesas e lucro líquido por período escolhido.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Resumo mensal e anual</li>
                <li>• Comparação entre períodos</li>
                <li>• Exportação em PDF/Excel</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <TrendingUp className="h-10 w-10 mb-2 text-primary" />
              <CardTitle>Análise por Plataforma</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3">
                Descubra qual app de entrega realmente paga melhor para você, considerando todos os fatores.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Receita por app</li>
                <li>• Comparação de performance</li>
                <li>• Identificação de tendências</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Target className="h-10 w-10 mb-2 text-primary" />
              <CardTitle>Métricas de Veículos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3">
                Relatórios completos sobre uso, consumo e custos do seu veículo.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Distância total rodada</li>
                <li>• Eficiência do veículo</li>
                <li>• Custo por quilômetro</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Download className="h-10 w-10 mb-2 text-primary" />
              <CardTitle>Exportação de Dados</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3">
                Exporte seus relatórios para análise offline ou para o seu contador.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• PDF profissional</li>
                <li>• Excel para planilhas</li>
                <li>• Dados completos</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Tax Estimation */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-primary/10 p-3 rounded-lg">
            <Calculator className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h2 className="text-3xl font-bold">Estimativa de Impostos</h2>
            <p className="text-muted-foreground">Planeje seus impostos com antecedência</p>
          </div>
        </div>
        <Card className="max-w-3xl mx-auto">
          <CardContent className="p-8">
            <p className="text-lg text-muted-foreground mb-4">
              Com base no seu país e lucro líquido, o Fintrak calcula automaticamente uma estimativa dos impostos que você pode precisar pagar.
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>✓ Estimativas baseadas nas regras fiscais do seu país</li>
              <li>✓ Suporte para mais de 200 países</li>
              <li>✓ Cálculo automático a partir do seu lucro líquido</li>
              <li>✓ Ajuda no planejamento financeiro</li>
              <li className="text-sm italic">Nota: As estimativas são apenas informativas. Consulte sempre um contador para cálculos oficiais.</li>
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* Mobile and Accessibility */}
      <section className="mb-16 bg-muted/30 rounded-lg p-8">
        <div className="max-w-3xl mx-auto text-center">
          <Smartphone className="h-16 w-16 text-primary mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Funciona no celular e computador</h2>
          <p className="text-lg text-muted-foreground mb-6">
            Acesse o Fintrak de qualquer dispositivo. Registre receitas e despesas pelo celular durante o trabalho, ou analise seus dados pelo computador em casa.
          </p>
          <div className="grid md:grid-cols-2 gap-4 text-left">
            <div>
              <h3 className="font-semibold mb-2">✓ Interface responsiva</h3>
              <p className="text-sm text-muted-foreground">Funciona perfeitamente em tablets e smartphones</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">✓ Sincronização automática</h3>
              <p className="text-sm text-muted-foreground">Seus dados estão sempre atualizados em todos os dispositivos</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">✓ Fácil de usar</h3>
              <p className="text-sm text-muted-foreground">Interface intuitiva que qualquer um pode usar</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">✓ Rápido e eficiente</h3>
              <p className="text-sm text-muted-foreground">Registre informações em segundos</p>
            </div>
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-primary/10 p-3 rounded-lg">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h2 className="text-3xl font-bold">Segurança e Privacidade</h2>
            <p className="text-muted-foreground">Seus dados financeiros protegidos</p>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Criptografia</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Todas as suas informações financeiras são criptografadas e armazenadas com segurança. Seus dados nunca são expostos.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Privacidade Total</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Você tem controle total sobre seus dados. Nós nunca compartilhamos, vendemos ou usamos suas informações para outros fins.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Backup Automático</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Seus dados são salvos automaticamente e com segurança. Você nunca vai perder suas informações.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center bg-primary text-primary-foreground rounded-lg p-12">
        <h2 className="text-3xl font-bold mb-4">Pronto para começar?</h2>
        <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
          Teste grátis agora mesmo e descubra todas as funcionalidades do Fintrak
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/signup">
            <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
              Começar Grátis
            </Button>
          </Link>
          <Link href="/pricing">
            <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
              Ver Planos
            </Button>
          </Link>
        </div>
      </section>
      </div>
      </main>
      <PublicFooter />
      <AIChatBot />
    </div>
  )
}
