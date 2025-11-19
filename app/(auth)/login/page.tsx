import { LoginForm } from "@/components/forms/LoginForm"
import { PublicHeader } from "@/components/public/PublicHeader"
import { PublicFooter } from "@/components/public/PublicFooter"
import { Suspense } from "react"

function LoginFormWrapper() {
  return <LoginForm />
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main className="flex-1 flex items-center justify-center bg-gray-50 px-4 py-8">
        <Suspense fallback={<div>Carregando...</div>}>
          <LoginFormWrapper />
        </Suspense>
      </main>
      <PublicFooter />
    </div>
  )
}



