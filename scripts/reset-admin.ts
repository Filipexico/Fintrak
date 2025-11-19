import { PrismaClient } from "@prisma/client"
import * as bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🔄 Resetando senha do admin...")

  // Buscar admin existente
  const admin = await prisma.user.findFirst({
    where: { role: "ADMIN" },
  })

  if (!admin) {
    console.log("❌ Nenhum admin encontrado. Execute o seed primeiro.")
    return
  }

  // Nova senha
  const newPassword = "Admin123!"
  const hashedPassword = await bcrypt.hash(newPassword, 12)

  // Atualizar senha
  await prisma.user.update({
    where: { id: admin.id },
    data: { password: hashedPassword },
  })

  console.log("✅ Senha do admin resetada com sucesso!")
  console.log(`\n📋 Credenciais de acesso:`)
  console.log(`   Email: ${admin.email}`)
  console.log(`   Senha: ${newPassword}`)
}

main()
  .catch((e) => {
    console.error("❌ Erro:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })



