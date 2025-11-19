import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function Home() {
  const session = await auth()

  if (!session) {
    // Sempre redirecionar para home quando não houver sessão
    redirect(`/home`)
  }

  // Redirecionar baseado no role
  if (session.user?.role === "ADMIN") {
    redirect("/admin")
  }

  redirect("/dashboard")
}
