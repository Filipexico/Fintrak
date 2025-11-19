import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { UserRole } from "@/lib/constants"

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
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true, // Necessário para Vercel/produção
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

