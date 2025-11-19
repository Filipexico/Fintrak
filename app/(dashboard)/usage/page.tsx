import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { UsageList } from "@/components/usage/UsageList"

export default async function UsagePage() {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="container mx-auto p-6">
      <UsageList />
    </div>
  )
}




