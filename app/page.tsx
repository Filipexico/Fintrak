import { redirect } from "next/navigation"

export default async function Home() {
  // Sempre redirecionar para home
  redirect(`/home`)
}
