import { RegisterFormWithPlan } from "@/components/forms/RegisterFormWithPlan"
import { Suspense } from "react"
import { PublicHeader } from "@/components/public/PublicHeader"
import { PublicFooter } from "@/components/public/PublicFooter"
import { AIChatBot } from "@/components/public/AIChatBot"

function SignupFormWrapper({ plan }: { plan?: string }) {
  return <RegisterFormWithPlan initialPlan={plan || "free"} locale="pt-BR" />
}

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>
}) {
  const { plan } = await searchParams

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <Suspense fallback={<div>Carregando...</div>}>
              <SignupFormWrapper plan={plan} />
            </Suspense>
          </div>
        </div>
      </main>
      <PublicFooter />
      <AIChatBot />
    </div>
  )
}

