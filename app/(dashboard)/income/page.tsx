import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { IncomeList } from "@/components/income/IncomeList"

export default async function IncomePage() {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Receitas</h1>
          <p className="mt-2 text-muted-foreground">
            Registre suas receitas de entregas
          </p>
        </div>
      </div>
      <IncomeList />
    </div>
  )
}




