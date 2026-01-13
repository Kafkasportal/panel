/**
 * API Helper Utilities
 * 
 * Common utilities for API routes including error handling,
 * rate limiting, and response formatting.
 */

import { NextRequest, NextResponse } from "next/server"
import { ZodError } from "zod"
import {
  createRateLimiter,
  RateLimitPresets,
  getClientIp,
  type RateLimitConfig,
} from "@/lib/rate-limit"

// Re-export RateLimitPresets for convenience
export { RateLimitPresets }

/**
 * Standard API error response format
 */
export interface ApiError {
  error: string
  message?: string
  details?: unknown
  code?: string
}

/**
 * Create a standardized error response
 */
export function createErrorResponse(
  error: unknown,
  defaultMessage: string,
  status: number = 500
): NextResponse<ApiError> {
  // Zod validation errors
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: "Validation hatası",
        message: "Girilen veriler geçersiz",
        details: error.issues,
        code: "VALIDATION_ERROR",
      },
      { status: 400 }
    )
  }

  // Standard Error objects
  if (error instanceof Error) {
    // Check for specific error types
    if (error.message.includes("duplicate") || error.message.includes("unique")) {
      return NextResponse.json(
        {
          error: "Çakışma hatası",
          message: "Bu kayıt zaten mevcut",
          details: error.message,
          code: "DUPLICATE_ERROR",
        },
        { status: 409 }
      )
    }

    if (error.message.includes("not found") || error.message.includes("bulunamadı")) {
      return NextResponse.json(
        {
          error: "Bulunamadı",
          message: error.message || "İstenen kayıt bulunamadı",
          code: "NOT_FOUND",
        },
        { status: 404 }
      )
    }

    if (error.message.includes("permission") || error.message.includes("yetki")) {
      return NextResponse.json(
        {
          error: "Yetki hatası",
          message: error.message || "Bu işlem için yetkiniz yok",
          code: "PERMISSION_ERROR",
        },
        { status: 403 }
      )
    }

    return NextResponse.json(
      {
        error: defaultMessage,
        message: error.message,
        code: "ERROR",
      },
      { status }
    )
  }

  // Unknown error type
  return NextResponse.json(
    {
      error: defaultMessage,
      message: "Beklenmeyen bir hata oluştu",
      code: "UNKNOWN_ERROR",
    },
    { status: 500 }
  )
}

/**
 * Create a standardized success response
 */
export function createSuccessResponse<T>(
  data: T,
  status: number = 200,
  meta?: Record<string, unknown>
): NextResponse<{ data: T; meta?: Record<string, unknown> }> {
  return NextResponse.json(
    {
      data,
      ...(meta && { meta }),
    },
    { status }
  )
}

/**
 * Rate limit middleware wrapper
 */
export function withRateLimit(
  handler: (req: NextRequest) => Promise<NextResponse>,
  config: RateLimitConfig = RateLimitPresets.standard
) {
  const rateLimiter = createRateLimiter(config)

  return async (req: NextRequest) => {
    const rateLimitResult = rateLimiter(req)

    if (rateLimitResult.limited) {
      return NextResponse.json(
        {
          error: "Rate limit aşıldı",
          message: "Çok fazla istek gönderdiniz. Lütfen daha sonra tekrar deneyin.",
          code: "RATE_LIMIT_EXCEEDED",
          resetTime: rateLimitResult.resetTime,
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": config.limit.toString(),
            "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
            "X-RateLimit-Reset": new Date(rateLimitResult.resetTime).toISOString(),
            "Retry-After": Math.ceil(
              (rateLimitResult.resetTime - Date.now()) / 1000
            ).toString(),
          },
        }
      )
    }

    const response = await handler(req)

    // Add rate limit headers to successful responses
    response.headers.set("X-RateLimit-Limit", config.limit.toString())
    response.headers.set("X-RateLimit-Remaining", rateLimitResult.remaining.toString())
    response.headers.set(
      "X-RateLimit-Reset",
      new Date(rateLimitResult.resetTime).toISOString()
    )

    return response
  }
}

/**
 * Async handler wrapper with error handling
 */
export function withErrorHandling(
  handler: (req: NextRequest) => Promise<NextResponse>,
  defaultErrorMessage: string
) {
  return async (req: NextRequest) => {
    try {
      return await handler(req)
    } catch (error) {
      console.error(`API Error [${req.method} ${req.nextUrl.pathname}]:`, error)
      return createErrorResponse(error, defaultErrorMessage)
    }
  }
}

/**
 * Combined wrapper: rate limiting + error handling
 */
export function withApiMiddleware(
  handler: (req: NextRequest) => Promise<NextResponse>,
  options: {
    defaultErrorMessage: string
    rateLimit?: RateLimitConfig
  }
) {
  const { defaultErrorMessage, rateLimit = RateLimitPresets.standard } = options

  return withRateLimit(
    withErrorHandling(handler, defaultErrorMessage),
    rateLimit
  )
}

/**
 * Get client IP from request
 */
export function getRequestIp(req: NextRequest): string {
  return getClientIp(req)
}

/**
 * Parse and validate JSON body
 */
export async function parseJsonBody<T>(
  req: NextRequest
): Promise<{ success: true; data: T } | { success: false; error: NextResponse }> {
  try {
    const body = await req.json()
    return { success: true, data: body as T }
  } catch (error) {
    return {
      success: false,
      error: createErrorResponse(
        new Error("Geçersiz JSON formatı"),
        "İstek gövdesi geçersiz",
        400
      ),
    }
  }
}

/**
 * Validate request method
 */
export function validateMethod(
  req: NextRequest,
  allowedMethods: string[]
): NextResponse | null {
  if (!allowedMethods.includes(req.method)) {
    return NextResponse.json(
      {
        error: "Method not allowed",
        message: `${req.method} metodu bu endpoint için desteklenmiyor`,
        code: "METHOD_NOT_ALLOWED",
      },
      { status: 405 }
    )
  }
  return null
}
