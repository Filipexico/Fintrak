import { PrismaClient } from "@prisma/client"
import * as bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Iniciando seed do banco de dados...")

  // Criar planos iniciais
  const plans = [
    {
      name: "free",
      displayName: "Free",
      priceMonthly: 0,
      description: "Basic plan with limited features",
      maxVehicles: 1,
      maxPlatforms: 1,
      isActive: true,
    },
    {
      name: "plus",
      displayName: "Plus",
      priceMonthly: 3,
      description: "Mid-tier plan with extended features",
      maxVehicles: 2,
      maxPlatforms: 2,
      isActive: true,
    },
    {
      name: "premium",
      displayName: "Premium",
      priceMonthly: 5,
      description: "Premium plan with all features and unlimited access",
      maxVehicles: null, // unlimited
      maxPlatforms: null, // unlimited
      isActive: true,
    },
  ]

  for (const planData of plans) {
    // @ts-ignore - Prisma Client gerado dinamicamente
    const plan = await prisma.plan.upsert({
      where: { name: planData.name },
      update: {
        displayName: planData.displayName,
        priceMonthly: planData.priceMonthly,
        description: planData.description,
        maxVehicles: planData.maxVehicles,
        maxPlatforms: planData.maxPlatforms,
        isActive: planData.isActive,
      },
      create: planData,
    })
    console.log(`✅ Plano criado: ${plan.displayName} (${plan.name})`)
  }

  // Criar usuário admin padrão (apenas se não existir admin)
  const adminCount = await prisma.user.count({
    where: { role: "ADMIN" },
  })

  if (adminCount === 0) {
    const hashedPassword = await bcrypt.hash("Admin123!", 12)

    const admin = await prisma.user.upsert({
      where: { email: "admin@example.com" },
      update: {},
      create: {
        email: "admin@example.com",
        password: hashedPassword,
        name: "Administrador",
        country: "BR",
        currency: "BRL",
        role: "ADMIN",
        isActive: true,
      },
    })

    console.log("✅ Usuário admin criado:", admin.email)
    console.log("   Email: admin@example.com")
    console.log("   Senha: Admin123!")
  } else {
    console.log("ℹ️  Admin já existe, pulando criação de admin padrão")
  }

  // Criar tax rules para TODOS os países do mundo
  const { ALL_COUNTRIES_TAX_RULES } = await import("../lib/data/countries")

  console.log(`🌍 Criando regras fiscais para ${ALL_COUNTRIES_TAX_RULES.length} países...`)

  let createdCount = 0
  let updatedCount = 0

  for (const rule of ALL_COUNTRIES_TAX_RULES) {
    const taxRule = await prisma.taxRule.upsert({
      where: { country: rule.country },
      update: {
        displayName: rule.displayName,
        percentage: rule.percentage,
        isActive: true,
      },
      create: {
        country: rule.country,
        displayName: rule.displayName,
        percentage: rule.percentage,
        isActive: true,
      },
    })

    if (taxRule.createdAt.getTime() === taxRule.updatedAt.getTime()) {
      createdCount++
    } else {
      updatedCount++
    }
  }

  console.log(`✅ Tax rules processadas: ${createdCount} criadas, ${updatedCount} atualizadas`)

  console.log("🎉 Seed concluído com sucesso!")
  
  if (adminCount === 0) {
    console.log("\n📋 Credenciais de acesso:")
    console.log("   Email: admin@example.com")
    console.log("   Senha: Admin123!")
    console.log("\n⚠️  IMPORTANTE: Altere a senha do admin após o primeiro login!")
  }
}

main()
  .catch((e) => {
    console.error("❌ Erro ao executar seed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

