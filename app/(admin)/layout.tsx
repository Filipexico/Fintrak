import { AdminLayout } from "@/components/layout/AdminLayout"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { SessionProvider } from "@/components/providers/SessionProvider"
import { ToastProvider } from "@/components/providers/ToastProvider"
import "../globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Admin - Fintrak",
  description: "Painel administrativo Fintrak",
}

export default function AdminGroupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <SessionProvider>
          <ToastProvider>
            <AdminLayout>{children}</AdminLayout>
          </ToastProvider>
        </SessionProvider>
      </body>
    </html>
  )
}



