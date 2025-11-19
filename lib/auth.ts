import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { UserRole } from "@/lib/constants"

// Validar variáveis de ambiente obrigatórias
// Usamos apenas NEXTAUTH_SECRET e NEXTAUTH_URL para manter consistência
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET

// Verificar se a variável obrigatória está presente
if (!NEXTAUTH_SECRET) {
  throw new Error(
    `❌ Variável de ambiente obrigatória faltando: NEXTAUTH_SECRET\n` +
    `Por favor, configure esta variável no arquivo .env ou nas variáveis de ambiente do Vercel.\n` +
    `Para gerar NEXTAUTH_SECRET, execute: openssl rand -base64 32`
  )
}

// URL base da aplicação (usado para callbacks e redirecionamentos)
// Fallback automático: produção usa o domínio Vercel, desenvolvimento usa localhost
const NEXTAUTH_URL = 
  process.env.NEXTAUTH_URL || 
  process.env.AUTH_URL || 
  (process.env.NODE_ENV === "production" 
    ? "https://fintrak-omega.vercel.app" 
    : "http://localhost:3000")

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          console.log("🔐 Tentativa de login para:", credentials?.email)
          
          if (!credentials?.email || !credentials?.password) {
            console.error("❌ Credenciais faltando")
            throw new Error("Email e senha são obrigatórios")
          }

          console.log("📊 Buscando usuário no banco...")
          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
          })

          if (!user) {
            console.error("❌ Usuário não encontrado:", credentials.email)
            throw new Error("Email ou senha inválidos")
          }

          console.log("✅ Usuário encontrado:", user.email, "Ativo:", user.isActive)

          if (!user.isActive) {
            console.error("⚠️ Conta desativada:", user.email)
            throw new Error("Conta desativada. Entre em contato com o suporte.")
          }

          console.log("🔒 Verificando senha...")
          const isPasswordValid = await bcrypt.compare(
            credentials.password as string,
            user.password
          )

          if (!isPasswordValid) {
            console.error("❌ Senha inválida para:", user.email)
            throw new Error("Email ou senha inválidos")
          }

          console.log("✅ Login bem-sucedido para:", user.email, "Role:", user.role)
          
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          }
        } catch (error) {
          console.error("❌ Erro no authorize:", error)
          if (error instanceof Error) {
            throw error
          }
          throw new Error("Erro ao fazer login. Tente novamente.")
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string
        session.user.role = token.role as UserRole
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 dias (recomendado para segurança)
  },
  secret: NEXTAUTH_SECRET,
  trustHost: true, // Necessário para Vercel/produção
  basePath: "/api/auth", // Caminho base para rotas de autenticação
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === "production" 
        ? "__Secure-authjs.session-token" 
        : "authjs.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production", // HTTPS apenas em produção
      },
    },
  },
})

