"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { signOut } from "next-auth/react"
import { useSession } from "next-auth/react"
import {
  LayoutDashboard,
  DollarSign,
  Receipt,
  Package,
  BarChart3,
  LogOut,
  User,
  Menu,
  X,
  Car,
  TrendingUp,
  Wrench,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { cn } from "@/lib/utils"
import Image from "next/image"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Receitas", href: "/income", icon: DollarSign },
  { name: "Despesas", href: "/expenses", icon: Receipt },
  { name: "Plataformas", href: "/platforms", icon: Package },
  { name: "Veículos", href: "/vehicles", icon: Car },
  { name: "Uso/Distância", href: "/usage", icon: TrendingUp },
  { name: "Manutenções", href: "/maintenances", icon: Wrench },
  { name: "Relatórios", href: "/reports", icon: BarChart3 },
]

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { data: session, status } = useSession({
    required: false,
    refetchInterval: 0, // Desabilitar refetch automático
    refetchOnWindowFocus: true, // Refazer quando a janela recebe foco (importante!)
  })
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" })
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform bg-white border-r border-border shadow-sm transition-transform duration-300 ease-in-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo/Header */}
          <div className="flex h-16 items-center justify-between border-b border-border px-4">
            <Link href="/home" className="hover:opacity-80 transition-opacity flex items-center">
              <Image 
                src="/imagens/fintrak_transparente.png" 
                alt="Fintrak" 
                width={330} 
                height={75}
                className="h-10 w-auto object-contain"
                priority
              />
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Fechar menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
              const Icon = item.icon

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-base font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* User section */}
          <div className="border-t border-border p-4 bg-muted/30">
            <div className="mb-3 flex items-center gap-3 px-3 py-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0 overflow-hidden">
                <p className="truncate text-sm font-medium text-foreground">
                  {session?.user?.name || "Usuário"}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {session?.user?.email}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full justify-start gap-2 text-sm"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar (mobile) */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background px-4 shadow-sm lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Abrir menu"
          >
            <Menu className="h-6 w-6" />
          </button>
          <Link href="/home" className="flex items-center hover:opacity-80 transition-opacity">
            <Image 
              src="/imagens/fintrak_transparente.png" 
              alt="Fintrak" 
              width={275} 
              height={62}
              className="h-8 w-auto object-contain"
            />
          </Link>
        </header>

        {/* Page content */}
        <main className="min-h-screen bg-neutral-50">{children}</main>
      </div>
    </div>
  )
}

