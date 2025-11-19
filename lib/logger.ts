/**
 * Logger centralizado para a aplicação
 * Substitui console.log/error por um sistema mais robusto
 */

type LogLevel = "info" | "warn" | "error" | "debug"

interface LogEntry {
  level: LogLevel
  message: string
  error?: Error
  metadata?: Record<string, unknown>
  timestamp: Date
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === "development"

  private log(level: LogLevel, message: string, error?: Error, metadata?: Record<string, unknown>) {
    const entry: LogEntry = {
      level,
      message,
      error,
      metadata,
      timestamp: new Date(),
    }

    // Em produção, você pode enviar para um serviço de logging
    // Por enquanto, apenas console
    if (this.isDevelopment || level === "error") {
      const prefix = `[${level.toUpperCase()}]`
      const timestamp = entry.timestamp.toISOString()

      switch (level) {
        case "error":
          console.error(prefix, timestamp, message, error || "", metadata || "")
          break
        case "warn":
          console.warn(prefix, timestamp, message, metadata || "")
          break
        case "debug":
          if (this.isDevelopment) {
            console.debug(prefix, timestamp, message, metadata || "")
          }
          break
        default:
          console.log(prefix, timestamp, message, metadata || "")
      }
    }
  }

  info(message: string, metadata?: Record<string, unknown>) {
    this.log("info", message, undefined, metadata)
  }

  warn(message: string, metadata?: Record<string, unknown>) {
    this.log("warn", message, undefined, metadata)
  }

  error(message: string, error?: Error, metadata?: Record<string, unknown>) {
    this.log("error", message, error, metadata)
  }

  debug(message: string, metadata?: Record<string, unknown>) {
    this.log("debug", message, undefined, metadata)
  }
}

export const logger = new Logger()



