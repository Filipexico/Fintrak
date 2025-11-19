import nodemailer from "nodemailer"
import { logger } from "@/lib/logger"

interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

/**
 * Cria um transporter de email usando as variáveis de ambiente
 * Se não configurado, retorna null
 */
function createTransporter() {
  const smtpHost = process.env.SMTP_HOST
  const smtpPort = process.env.SMTP_PORT
  const smtpUser = process.env.SMTP_USER
  const smtpPass = process.env.SMTP_PASS
  const smtpFrom = process.env.SMTP_FROM || smtpUser || "noreply@fintrak.com"

  if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
    logger.warn("SMTP não configurado. Emails não serão enviados.")
    return null
  }

  return nodemailer.createTransport({
    host: smtpHost,
    port: parseInt(smtpPort, 10),
    secure: parseInt(smtpPort, 10) === 465, // true para 465, false para outras portas
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
    from: smtpFrom,
  })
}

/**
 * Envia um email usando nodemailer
 * Se SMTP não estiver configurado, apenas loga a mensagem
 */
export async function sendEmail({ to, subject, html, text }: EmailOptions): Promise<boolean> {
  const transporter = createTransporter()

  if (!transporter) {
    // Log para desenvolvimento - em produção, você pode querer lançar um erro
    logger.info("Email não enviado (SMTP não configurado):", {
      to,
      subject,
      preview: text || html.substring(0, 100),
    })
    return false
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER || "noreply@fintrak.com",
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ""), // Remove HTML tags para versão texto
    })

    logger.info("Email enviado com sucesso:", {
      to,
      subject,
      messageId: info.messageId,
    })
    return true
  } catch (error) {
    logger.error("Erro ao enviar email:", error instanceof Error ? error : undefined)
    return false
  }
}

/**
 * Envia email de contato do formulário
 */
export async function sendContactEmail(data: {
  name: string
  email: string
  subject?: string
  message: string
  plan?: string
}): Promise<boolean> {
  const subject = `Fintrak - ${data.subject || "Contato"}`

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #ff6600;">Nova mensagem de contato - Fintrak</h2>
      
      <div style="background: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Nome:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        ${data.plan ? `<p><strong>Plano de interesse:</strong> ${data.plan}</p>` : ""}
        ${data.subject ? `<p><strong>Assunto:</strong> ${data.subject}</p>` : ""}
      </div>
      
      <div style="margin: 20px 0;">
        <h3 style="color: #333;">Mensagem:</h3>
        <p style="white-space: pre-wrap; line-height: 1.6;">${data.message}</p>
      </div>
      
      <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;" />
      
      <p style="color: #666; font-size: 12px;">
        Esta mensagem foi enviada através do formulário de contato do Fintrak.
      </p>
    </div>
  `

  return sendEmail({
    to: "filipe@filipefrancisco.com",
    subject,
    html,
  })
}

/**
 * Envia email de confirmação de registro com plano pago
 */
export async function sendRegistrationEmail(data: {
  userName: string
  userEmail: string
  planName: string
  planDisplayName: string
  planPrice: number | string
  userCountry: string
  userCurrency: string
}): Promise<boolean> {
  const subject = "Fintrak - Nova aquisição de plano pago"

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #ff6600;">Nova aquisição - Fintrak</h2>
      
      <div style="background: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Informações do Cliente</h3>
        <p><strong>Nome:</strong> ${data.userName}</p>
        <p><strong>Email:</strong> ${data.userEmail}</p>
        <p><strong>País:</strong> ${data.userCountry}</p>
        <p><strong>Moeda:</strong> ${data.userCurrency}</p>
      </div>
      
      <div style="background: #fff4e6; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ff6600;">
        <h3 style="margin-top: 0; color: #ff6600;">Plano Adquirido</h3>
        <p><strong>Plano:</strong> ${data.planDisplayName} (${data.planName})</p>
        <p><strong>Valor:</strong> €${Number(data.planPrice).toFixed(2)}/mês</p>
        <p><strong>Data:</strong> ${new Date().toLocaleDateString("pt-BR")} às ${new Date().toLocaleTimeString("pt-BR")}</p>
      </div>
      
      <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;" />
      
      <p style="color: #666; font-size: 12px;">
        Este email foi enviado automaticamente quando um novo usuário se registrou com um plano pago no Fintrak.
      </p>
    </div>
  `

  return sendEmail({
    to: "filipe@filipefrancisco.com",
    subject,
    html,
  })
}

/**
 * Envia email quando um pagamento é registrado
 */
export async function sendPaymentEmail(data: {
  userName: string
  userEmail: string
  paymentAmount: number | string
  paymentCurrency: string
  paymentMethod: string
  paymentDate: string
  planName?: string
  planDisplayName?: string
  paymentStatus: string
  description?: string
}): Promise<boolean> {
  const subject = "Fintrak - Novo pagamento registrado"

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #ff6600;">Novo pagamento registrado - Fintrak</h2>
      
      <div style="background: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Informações do Cliente</h3>
        <p><strong>Nome:</strong> ${data.userName}</p>
        <p><strong>Email:</strong> ${data.userEmail}</p>
      </div>
      
      <div style="background: #e6f7e6; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #52c41a;">
        <h3 style="margin-top: 0; color: #52c41a;">Detalhes do Pagamento</h3>
        <p><strong>Valor:</strong> ${data.paymentCurrency} ${Number(data.paymentAmount).toFixed(2)}</p>
        <p><strong>Método:</strong> ${data.paymentMethod}</p>
        <p><strong>Status:</strong> ${data.paymentStatus}</p>
        <p><strong>Data:</strong> ${data.paymentDate}</p>
        ${data.planName ? `<p><strong>Plano:</strong> ${data.planDisplayName || data.planName}</p>` : ""}
        ${data.description ? `<p><strong>Descrição:</strong> ${data.description}</p>` : ""}
      </div>
      
      <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;" />
      
      <p style="color: #666; font-size: 12px;">
        Este email foi enviado automaticamente quando um novo pagamento foi registrado no sistema Fintrak.
      </p>
    </div>
  `

  return sendEmail({
    to: "filipe@filipefrancisco.com",
    subject,
    html,
  })
}


