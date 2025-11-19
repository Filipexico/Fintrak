import { logger } from "@/lib/logger"
import type { ApiError, ApiResponse } from "@/types/api"

/**
 * Utilitários para chamadas de API
 */

export interface FetchOptions extends RequestInit {
  timeout?: number
}

/**
 * Wrapper para fetch com tratamento de erros padronizado
 */
export async function apiFetch<T>(
  url: string,
  options?: FetchOptions
): Promise<ApiResponse<T>> {
  const { timeout = 10000, ...fetchOptions } = options || {}

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...fetchOptions.headers,
      },
    })

    clearTimeout(timeoutId)

    const data = await response.json()

    if (!response.ok) {
      const error: ApiError = data.error
        ? { error: data.error, details: data.details }
        : { error: `HTTP ${response.status}: ${response.statusText}` }

      logger.error(`API Error: ${url}`, undefined, {
        status: response.status,
        error: error.error,
      })

      return { error: error.error, details: error.details }
    }

    return { data: data as T }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Erro desconhecido"

    logger.error(`Fetch Error: ${url}`, error instanceof Error ? error : undefined, {
      url,
      method: fetchOptions?.method || "GET",
    })

    return {
      error: errorMessage,
    }
  }
}

/**
 * Helper para fazer POST requests
 */
export async function apiPost<T>(
  url: string,
  body: unknown,
  options?: FetchOptions
): Promise<ApiResponse<T>> {
  return apiFetch<T>(url, {
    ...options,
    method: "POST",
    body: JSON.stringify(body),
  })
}

/**
 * Helper para fazer PUT requests
 */
export async function apiPut<T>(
  url: string,
  body: unknown,
  options?: FetchOptions
): Promise<ApiResponse<T>> {
  return apiFetch<T>(url, {
    ...options,
    method: "PUT",
    body: JSON.stringify(body),
  })
}

/**
 * Helper para fazer DELETE requests
 */
export async function apiDelete<T>(
  url: string,
  options?: FetchOptions
): Promise<ApiResponse<T>> {
  return apiFetch<T>(url, {
    ...options,
    method: "DELETE",
  })
}




