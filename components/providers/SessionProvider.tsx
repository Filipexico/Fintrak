"use client"

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react"

export function SessionProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextAuthSessionProvider
      refetchInterval={0} // Desabilitar refetch automático - vamos fazer manualmente quando necessário
      refetchOnWindowFocus={true} // Refazer busca quando a janela recebe foco (importante!)
    >
      {children}
    </NextAuthSessionProvider>
  )
}




