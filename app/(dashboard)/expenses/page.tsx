import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { ExpensesList } from "@/components/expenses/ExpensesList"

export default async function ExpensesPage() {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Despesas</h1>
          <p className="mt-2 text-muted-foreground">
            Registre suas despesas de trabalho
          </p>
        </div>
      </div>
      <ExpensesList />
    </div>
  )
}




