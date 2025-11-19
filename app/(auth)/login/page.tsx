import { LoginForm } from "@/components/forms/LoginForm"
import { Suspense } from "react"

function LoginFormWrapper() {
  return <LoginForm />
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Suspense fallback={<div>Carregando...</div>}>
        <LoginFormWrapper />
      </Suspense>
    </div>
  )
}



