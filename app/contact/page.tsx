"use client"

import { useState, Suspense } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { PublicHeader } from "@/components/public/PublicHeader"
import { PublicFooter } from "@/components/public/PublicFooter"
import { AIChatBot } from "@/components/public/AIChatBot"
import { useToastContext } from "@/components/providers/ToastProvider"
import { Loader2, Send } from "lucide-react"

const contactSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  subject: z.string().optional(),
  message: z.string().min(10, "Mensagem deve ter pelo menos 10 caracteres"),
})

type ContactFormData = z.infer<typeof contactSchema>

function ContactForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const plan = searchParams.get("plan")
  const { success, error: showError } = useToastContext()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      subject: plan === "plus" ? "Interesse no plano Plus" : undefined,
    },
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          plan: plan || undefined,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        const errorMsg = result.error || "Erro ao enviar mensagem"
        showError(errorMsg)
        setIsSubmitting(false)
        return
      }

      success("Mensagem enviada com sucesso! Entraremos em contato em breve.")
      reset()
      setTimeout(() => {
        router.push("/home")
      }, 2000)
    } catch (error) {
      showError("Erro ao enviar mensagem. Tente novamente.")
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4">Entre em contato</h1>
              <p className="text-xl text-muted-foreground">
                {plan === "plus"
                  ? "Preencha o formulário abaixo para solicitar o plano Plus"
                  : "Tem dúvidas ou sugestões? Envie uma mensagem e responderemos o mais rápido possível."}
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Formulário de Contato</CardTitle>
                <CardDescription>
                  Preencha os dados abaixo e entraremos em contato
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome completo *</Label>
                    <Input
                      id="name"
                      {...register("name")}
                      placeholder="Seu nome completo"
                      disabled={isSubmitting}
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      placeholder="seu@email.com"
                      disabled={isSubmitting}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Assunto</Label>
                    <Input
                      id="subject"
                      {...register("subject")}
                      placeholder="Assunto da mensagem"
                      disabled={isSubmitting}
                    />
                    {errors.subject && (
                      <p className="text-sm text-destructive">{errors.subject.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Mensagem *</Label>
                    <textarea
                      id="message"
                      {...register("message")}
                      rows={6}
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder={
                        plan === "plus"
                          ? "Conte-nos mais sobre seu interesse no plano Plus..."
                          : "Digite sua mensagem aqui..."
                      }
                      disabled={isSubmitting}
                    />
                    {errors.message && (
                      <p className="text-sm text-destructive">{errors.message.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Enviar Mensagem
                      </>
                    )}
                  </Button>
                </form>

                {plan === "plus" && (
                  <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
                    <p className="text-sm text-muted-foreground">
                      <strong>Plano Plus:</strong> Após recebermos sua mensagem, entraremos em contato
                      com as instruções para ativação do plano Plus (€3/mês) com 2 veículos e 2
                      plataformas.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
    </div>
  )
}

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16">
          <Suspense fallback={<div className="text-center py-8">Carregando...</div>}>
            <ContactForm />
          </Suspense>
        </div>
      </main>
      <PublicFooter />
      <AIChatBot />
    </div>
  )
}

