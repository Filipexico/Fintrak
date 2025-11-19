import jsPDF from "jspdf"
import * as XLSX from "xlsx"

/**
 * Exporta dados para PDF
 */
export function exportToPDF(
  title: string,
  headers: string[],
  rows: (string | number)[][],
  filename: string = "relatorio.pdf"
) {
  const doc = new jsPDF()
  
  // Título
  doc.setFontSize(16)
  doc.text(title, 14, 15)
  
  // Cabeçalhos
  doc.setFontSize(10)
  let y = 25
  const startX = 14
  const colWidth = 40
  
  headers.forEach((header, index) => {
    doc.text(header, startX + index * colWidth, y)
  })
  
  y += 5
  
  // Linhas
  doc.setFontSize(9)
  rows.forEach((row) => {
    row.forEach((cell, index) => {
      const text = String(cell)
      doc.text(text.substring(0, 15), startX + index * colWidth, y) // Limitar tamanho
    })
    y += 5
    if (y > 280) {
      doc.addPage()
      y = 15
    }
  })
  
  doc.save(filename)
}

/**
 * Exporta dados para Excel
 */
export function exportToExcel(
  sheetName: string,
  headers: string[],
  rows: (string | number)[][],
  filename: string = "relatorio.xlsx"
) {
  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows])
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
  XLSX.writeFile(workbook, filename)
}

/**
 * Exporta relatório financeiro
 */
export function exportFinancialReport(
  data: {
    summary: {
      totalIncome: number
      totalExpenses: number
      netProfit: number
      estimatedTax: number
      currency: string
    }
    monthlyData: Array<{ month: string; income: number; expenses: number; profit: number }>
    platformData: Array<{ platformName: string; total: number; percentage: number }>
    categoryData: Array<{ category: string; total: number; percentage: number }>
  },
  format: "pdf" | "xlsx"
) {
  const { summary, monthlyData, platformData, categoryData } = data
  
  if (format === "pdf") {
    const doc = new jsPDF()
    
    // Título
    doc.setFontSize(16)
    doc.text("Relatório Financeiro", 14, 15)
    
    // Resumo
    doc.setFontSize(12)
    doc.text("Resumo", 14, 25)
    doc.setFontSize(10)
    doc.text(`Receita Total: ${summary.totalIncome.toFixed(2)} ${summary.currency}`, 14, 32)
    doc.text(`Despesas Totais: ${summary.totalExpenses.toFixed(2)} ${summary.currency}`, 14, 37)
    doc.text(`Lucro Líquido: ${summary.netProfit.toFixed(2)} ${summary.currency}`, 14, 42)
    doc.text(`Imposto Estimado: ${summary.estimatedTax.toFixed(2)} ${summary.currency}`, 14, 47)
    
    // Dados Mensais
    let y = 57
    doc.setFontSize(12)
    doc.text("Dados Mensais", 14, y)
    y += 5
    doc.setFontSize(9)
    monthlyData.forEach((item) => {
      doc.text(`${item.month}: R$ ${item.income.toFixed(2)} / R$ ${item.expenses.toFixed(2)}`, 14, y)
      y += 5
      if (y > 280) {
        doc.addPage()
        y = 15
      }
    })
    
    doc.save("relatorio-financeiro.pdf")
  } else {
    // Excel
    const workbook = XLSX.utils.book_new()
    
    // Resumo
    const summarySheet = XLSX.utils.aoa_to_sheet([
      ["Relatório Financeiro"],
      [],
      ["Receita Total", summary.totalIncome],
      ["Despesas Totais", summary.totalExpenses],
      ["Lucro Líquido", summary.netProfit],
      ["Imposto Estimado", summary.estimatedTax],
    ])
    XLSX.utils.book_append_sheet(workbook, summarySheet, "Resumo")
    
    // Mensal
    const monthlySheet = XLSX.utils.aoa_to_sheet([
      ["Mês", "Receita", "Despesas", "Lucro"],
      ...monthlyData.map((item) => [item.month, item.income, item.expenses, item.profit]),
    ])
    XLSX.utils.book_append_sheet(workbook, monthlySheet, "Mensal")
    
    // Plataformas
    const platformSheet = XLSX.utils.aoa_to_sheet([
      ["Plataforma", "Total", "Percentual"],
      ...platformData.map((item) => [item.platformName, item.total, `${item.percentage.toFixed(2)}%`]),
    ])
    XLSX.utils.book_append_sheet(workbook, platformSheet, "Plataformas")
    
    // Categorias
    const categorySheet = XLSX.utils.aoa_to_sheet([
      ["Categoria", "Total", "Percentual"],
      ...categoryData.map((item) => [item.category, item.total, `${item.percentage.toFixed(2)}%`]),
    ])
    XLSX.utils.book_append_sheet(workbook, categorySheet, "Categorias")
    
    XLSX.writeFile(workbook, "relatorio-financeiro.xlsx")
  }
}

/**
 * Exporta relatório de veículos
 */
export function exportVehicleReport(
  data: {
    summary: {
      totalDistance: number
      totalFuel: number
      totalEnergy: number
      avgKmPerLiter: number | null
      avgKmPerKwh: number | null
      totalLogs: number
    }
    dailyDistance: Array<{ date: string; distance: number }>
    dailyFuel: Array<{ date: string; fuel?: number; energy?: number }>
  },
  format: "pdf" | "xlsx"
) {
  const { summary, dailyDistance, dailyFuel } = data
  
  if (format === "pdf") {
    const doc = new jsPDF()
    
    doc.setFontSize(16)
    doc.text("Relatório de Veículos", 14, 15)
    
    doc.setFontSize(12)
    doc.text("Resumo", 14, 25)
    doc.setFontSize(10)
    doc.text(`Distância Total: ${summary.totalDistance.toFixed(2)} km`, 14, 32)
    if (summary.totalEnergy > 0) {
      doc.text(`Energia Total: ${summary.totalEnergy.toFixed(2)} kWh`, 14, 37)
      if (summary.avgKmPerKwh) {
        doc.text(`Média km/kWh: ${summary.avgKmPerKwh}`, 14, 42)
      }
    } else {
      doc.text(`Combustível Total: ${summary.totalFuel.toFixed(2)} L`, 14, 37)
      if (summary.avgKmPerLiter) {
        doc.text(`Média km/L: ${summary.avgKmPerLiter}`, 14, 42)
      }
    }
    doc.text(`Total de Registros: ${summary.totalLogs}`, 14, 47)
    
    doc.save("relatorio-veiculos.pdf")
  } else {
    const workbook = XLSX.utils.book_new()
    
    const summarySheet = XLSX.utils.aoa_to_sheet([
      ["Relatório de Veículos"],
      [],
      ["Distância Total (km)", summary.totalDistance],
      summary.totalEnergy > 0
        ? ["Energia Total (kWh)", summary.totalEnergy]
        : ["Combustível Total (L)", summary.totalFuel],
      summary.avgKmPerKwh
        ? ["Média km/kWh", summary.avgKmPerKwh]
        : ["Média km/L", summary.avgKmPerLiter || "N/A"],
      ["Total de Registros", summary.totalLogs],
    ])
    XLSX.utils.book_append_sheet(workbook, summarySheet, "Resumo")
    
    const distanceSheet = XLSX.utils.aoa_to_sheet([
      ["Data", "Distância (km)"],
      ...dailyDistance.map((item) => [item.date, item.distance]),
    ])
    XLSX.utils.book_append_sheet(workbook, distanceSheet, "Distância Diária")
    
    const hasEnergy = dailyFuel.some((item) => item.energy)
    const fuelSheet = XLSX.utils.aoa_to_sheet([
      hasEnergy ? ["Data", "Energia (kWh)"] : ["Data", "Combustível (L)"],
      ...dailyFuel.map((item) => [
        item.date,
        item.energy || item.fuel || 0,
      ]),
    ])
    XLSX.utils.book_append_sheet(
      workbook,
      fuelSheet,
      hasEnergy ? "Energia Diária" : "Combustível Diário"
    )
    
    XLSX.writeFile(workbook, "relatorio-veiculos.xlsx")
  }
}

