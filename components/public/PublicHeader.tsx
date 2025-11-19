"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export function PublicHeader() {
  return (
    <header className="border-b bg-background shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/home" className="flex items-center hover:opacity-80 transition-opacity">
          <Image 
            src="/imagens/fintrak_transparente.png" 
            alt="Fintrak" 
            width={330} 
            height={75}
            className="h-10 md:h-12 w-auto object-contain"
            priority
          />
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/home" className="text-base font-medium hover:text-primary transition-colors">
            Início
          </Link>
          <Link href="/features" className="text-base font-medium hover:text-primary transition-colors">
            Funcionalidades
          </Link>
          <Link href="/pricing" className="text-base font-medium hover:text-primary transition-colors">
            Preços
          </Link>
          <Link href="/faq" className="text-base font-medium hover:text-primary transition-colors">
            Perguntas
          </Link>
          <Link href="/contact" className="text-base font-medium hover:text-primary transition-colors">
            Contato
          </Link>
        </nav>

        <div className="flex items-center gap-4 ml-8">
          <Link href="/signup">
            <Button variant="default" className="bg-primary hover:bg-primary/90">Cadastrar</Button>
          </Link>
          <Link href="/login">
            <Button variant="outline">Entrar</Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
