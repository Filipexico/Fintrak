"use client"

import { PublicHeader } from "@/components/public/PublicHeader"
import { PublicFooter } from "@/components/public/PublicFooter"
import { SessionProvider } from "@/components/providers/SessionProvider"
import { ToastProvider } from "@/components/providers/ToastProvider"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <ToastProvider>
        <div className="flex min-h-screen flex-col">
          <PublicHeader />
          <main className="flex-1">{children}</main>
          <PublicFooter />
        </div>
      </ToastProvider>
    </SessionProvider>
  )
}
