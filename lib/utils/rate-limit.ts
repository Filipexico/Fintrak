/**
 * Rate Limiting Utilities
 * 
 * RECOMENDAÇÃO: Implementar rate limiting em produção usando:
 * - @upstash/ratelimit (para Vercel/Edge)
 * - express-rate-limit (para Node.js tradicional)
 * - Redis-based solution
 * 
 * Este arquivo contém a estrutura base para implementação futura.
 */

import { NextRequest, NextResponse } from "next/server"

export interface RateLimitConfig {
  maxRequests: number
  windowMs: number
  identifier?: string
}

/**
 * Rate limit check (placeholder - implementar com solução real)
 * 
 * Em produção, usar:
 * - @upstash/ratelimit para Vercel
 * - express-rate-limit para Node.js
 * - Redis para soluções customizadas
 */
export async function checkRateLimit(
  request: NextRequest,
  config: RateLimitConfig
): Promise<{ allowed: boolean; remaining?: number; reset?: Date }> {
  // TODO: Implementar rate limiting real
  // Exemplo com @upstash/ratelimit:
  /*
  import { Ratelimit } from "@upstash/ratelimit"
  import { Redis } from "@upstash/redis"
  
  const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(config.maxRequests, `${config.windowMs} ms`),
    analytics: true,
  })
  
  const identifier = config.identifier || request.ip || "anonymous"
  const { success, remaining, reset } = await ratelimit.limit(identifier)
  
  return {
    allowed: success,
    remaining,
    reset: reset ? new Date(reset) : undefined,
  }
  */
  
  // Por enquanto, sempre permite (implementar em produção)
  return { allowed: true }
}

/**
 * Middleware helper para rate limiting
 */
export async function withRateLimit(
  request: NextRequest,
  config: RateLimitConfig,
  handler: () => Promise<NextResponse>
): Promise<NextResponse> {
  const rateLimit = await checkRateLimit(request, config)
  
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Muitas requisições. Tente novamente mais tarde." },
      { 
        status: 429,
        headers: {
          "X-RateLimit-Limit": config.maxRequests.toString(),
          "X-RateLimit-Remaining": rateLimit.remaining?.toString() || "0",
          "Retry-After": rateLimit.reset 
            ? Math.ceil((rateLimit.reset.getTime() - Date.now()) / 1000).toString()
            : "60",
        },
      }
    )
  }
  
  return handler()
}

/**
 * Configurações recomendadas de rate limit
 */
export const RATE_LIMIT_CONFIGS = {
  // Autenticação - mais restritivo
  AUTH: {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000, // 15 minutos
  },
  // APIs gerais
  API: {
    maxRequests: 100,
    windowMs: 60 * 1000, // 1 minuto
  },
  // Registro - muito restritivo
  REGISTER: {
    maxRequests: 3,
    windowMs: 60 * 60 * 1000, // 1 hora
  },
} as const



