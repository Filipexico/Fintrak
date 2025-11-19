import { DashboardLayout } from "@/components/layout/DashboardLayout"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { SessionProvider } from "@/components/providers/SessionProvider"
import { ToastProvider } from "@/components/providers/ToastProvider"
import "../globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Dashboard - Fintrak",
  description: "Painel de controle financeiro Fintrak",
}

export default function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <SessionProvider>
          <ToastProvider>
            <DashboardLayout>{children}</DashboardLayout>
          </ToastProvider>
        </SessionProvider>
      </body>
    </html>
  )
}



