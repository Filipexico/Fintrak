"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export function PublicHeader() {
  return (
    <header className="border-b bg-background shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/home" className="flex items-center hover:opacity-80 transition-opacity p-2 md:p-3">
          <Image 
            src="/imagens/fintrak_transparente.png" 
            alt="Fintrak" 
            width={743} 
            height={170}
            className="h-[120px] md:h-[170px] w-[575px] md:w-[743px] object-contain min-w-[507px] md:min-w-[743px]"
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
