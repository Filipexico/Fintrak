import { prisma } from "@/lib/prisma"
import { createUsageLogWhere, type UsageLogWhereInput } from "@/types/prisma"

/**
 * Resumo de uso de veículos para um período
 */
export async function getVehicleSummary(
  userId: string,
  startDate: Date,
  endDate: Date,
  vehicleId?: string
) {
  const where: UsageLogWhereInput = createUsageLogWhere(userId, {
    startDate,
    endDate,
    vehicleId,
  })

  const logs = await prisma.usageLog.findMany({
    where,
    select: {
      distanceKm: true,
      fuelLiters: true,
      energyKwh: true,
    },
  })

  const totalDistance = logs.reduce((sum, log) => sum + Number(log.distanceKm), 0)
  const totalFuel = logs
    .filter((log) => log.fuelLiters && Number(log.fuelLiters) > 0)
    .reduce((sum, log) => sum + Number(log.fuelLiters!), 0)
  const totalEnergy = logs
    .filter((log) => log.energyKwh && Number(log.energyKwh) > 0)
    .reduce((sum, log) => sum + Number(log.energyKwh!), 0)

  const logsWithFuel = logs.filter((log) => log.fuelLiters && Number(log.fuelLiters) > 0)
  const logsWithEnergy = logs.filter((log) => log.energyKwh && Number(log.energyKwh) > 0)
  
  const avgKmPerLiter =
    logsWithFuel.length > 0 && totalFuel > 0
      ? Number((totalDistance / totalFuel).toFixed(2))
      : null

  const avgKmPerKwh =
    logsWithEnergy.length > 0 && totalEnergy > 0
      ? Number((totalDistance / totalEnergy).toFixed(2))
      : null

  return {
    totalDistance: Number(totalDistance.toFixed(2)),
    totalFuel: Number(totalFuel.toFixed(2)),
    totalEnergy: Number(totalEnergy.toFixed(2)),
    avgKmPerLiter,
    avgKmPerKwh,
    totalLogs: logs.length,
    logsWithFuel: logsWithFuel.length,
    logsWithEnergy: logsWithEnergy.length,
  }
}

/**
 * Dados diários de distância para gráfico
 */
export async function getDailyDistanceData(
  userId: string,
  startDate: Date,
  endDate: Date,
  vehicleId?: string
) {
  const where: UsageLogWhereInput = createUsageLogWhere(userId, {
    startDate,
    endDate,
    vehicleId,
  })

  const logs = await prisma.usageLog.findMany({
    where,
    select: {
      date: true,
      distanceKm: true,
    },
    orderBy: {
      date: "asc",
    },
  })

  // Agrupar por data
  const dailyMap = new Map<string, number>()
  logs.forEach((log) => {
    const dateKey = log.date.toISOString().split("T")[0]
    const current = dailyMap.get(dateKey) || 0
    dailyMap.set(dateKey, current + Number(log.distanceKm))
  })

  // Converter para array e formatar
  return Array.from(dailyMap.entries())
    .map(([date, distance]) => ({
      date,
      distance: Number(distance.toFixed(2)),
    }))
    .sort((a, b) => a.date.localeCompare(b.date))
}

/**
 * Dados diários de combustível para gráfico
 */
export async function getDailyFuelData(
  userId: string,
  startDate: Date,
  endDate: Date,
  vehicleId?: string
) {
  const where: UsageLogWhereInput = createUsageLogWhere(userId, {
    startDate,
    endDate,
    vehicleId,
  })

  const logs = await prisma.usageLog.findMany({
    where,
    select: {
      date: true,
      fuelLiters: true,
      energyKwh: true,
    },
    orderBy: {
      date: "asc",
    },
  })

  // Agrupar por data (combustível e energia)
  const dailyFuelMap = new Map<string, number>()
  const dailyEnergyMap = new Map<string, number>()
  
  logs.forEach((log) => {
    const dateKey = log.date.toISOString().split("T")[0]
    
    if (log.fuelLiters && Number(log.fuelLiters) > 0) {
      const current = dailyFuelMap.get(dateKey) || 0
      dailyFuelMap.set(dateKey, current + Number(log.fuelLiters))
    }
    
    if (log.energyKwh && Number(log.energyKwh) > 0) {
      const current = dailyEnergyMap.get(dateKey) || 0
      dailyEnergyMap.set(dateKey, current + Number(log.energyKwh))
    }
  })

  // Converter para array e formatar (priorizar energia se houver)
  if (dailyEnergyMap.size > 0) {
    return Array.from(dailyEnergyMap.entries())
      .map(([date, energy]) => ({
        date,
        energy: Number(energy.toFixed(2)),
      }))
      .sort((a, b) => a.date.localeCompare(b.date))
  }

  return Array.from(dailyFuelMap.entries())
    .map(([date, fuel]) => ({
      date,
      fuel: Number(fuel.toFixed(2)),
    }))
    .sort((a, b) => a.date.localeCompare(b.date))
}

/**
 * Custo por km (integração com despesas de combustível)
 */
export async function getCostPerKm(
  userId: string,
  startDate: Date,
  endDate: Date,
  vehicleId?: string
) {
  // Buscar logs de uso
  const usageWhere: UsageLogWhereInput = createUsageLogWhere(userId, {
    startDate,
    endDate,
    vehicleId,
  })

  const logs = await prisma.usageLog.findMany({
    where: usageWhere,
    select: {
      distanceKm: true,
    },
  })

  const totalDistance = logs.reduce((sum, log) => sum + Number(log.distanceKm), 0)

  // Buscar despesas de combustível no mesmo período
  const expenses = await prisma.expense.findMany({
    where: {
      userId,
      category: "fuel",
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: {
      amount: true,
      currency: true,
    },
  })

  const totalFuelCost = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0)

  const costPerKm = totalDistance > 0 && totalFuelCost > 0
    ? Number((totalFuelCost / totalDistance).toFixed(4))
    : null

  return {
    totalDistance: Number(totalDistance.toFixed(2)),
    totalFuelCost: Number(totalFuelCost.toFixed(2)),
    costPerKm,
    currency: expenses[0]?.currency || "BRL",
  }
}

