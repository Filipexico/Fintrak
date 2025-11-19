import { PrismaClient } from "@prisma/client"
import * as bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🔐 Criando/atualizando usuário admin...")

  const adminEmail = "admin@fintrak.app"
  const adminPassword = "@Rosa1809"
  const hashedPassword = await bcrypt.hash(adminPassword, 12)

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedPassword,
      name: "Admin Fintrak",
      role: "ADMIN",
      isActive: true,
    },
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: "Admin Fintrak",
      country: "BR",
      currency: "BRL",
      language: "pt-BR",
      role: "ADMIN",
      isActive: true,
    },
  })

  console.log("✅ Usuário admin criado/atualizado com sucesso!")
  console.log("\n📋 Credenciais de acesso:")
  console.log(`   Email: ${admin.email}`)
  console.log(`   Senha: ${adminPassword}`)
  console.log("\n⚠️  IMPORTANTE: Mantenha estas credenciais seguras!")
}

main()
  .catch((e) => {
    console.error("❌ Erro ao criar/atualizar admin:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

