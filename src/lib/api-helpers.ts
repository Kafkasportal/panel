import { NextRequest, NextResponse } from "next/server"
import { createRateLimiter, type RateLimitConfig, RateLimitPresets, getClientIp } from "@/lib/rate-limit"

// Re-export RateLimitPresets for convenience
export { RateLimitPresets }

/**
 * Standardized error response
 */
export function createErrorResponse(
  error: unknown,
  message: string,
  status: number = 500
): NextResponse {
  const errorMessage = error instanceof Error ? error.message : String(error)

  return NextResponse.json(
    {
      error: message,
      message: errorMessage,
      status,
    },
    { status }
  )
}

/**
 * Standardized success response
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
 * Rate limiting wrapper
 */
export function withRateLimit(
  handler: (req: NextRequest) => Promise<NextResponse>,
  config: RateLimitConfig = RateLimitPresets.standard
) {
  const limiter = createRateLimiter(config)

  return async (req: NextRequest) => {
    const result = limiter(req)

    if (result.limited) {
      const resetSeconds = Math.ceil((result.resetTime - Date.now()) / 1000)
      return NextResponse.json(
        {
          error: "Too many requests",
          message: `Rate limit exceeded. Try again in ${resetSeconds} seconds.`,
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": String(config.limit),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(result.resetTime),
            "Retry-After": String(resetSeconds),
          },
        }
      )
    }

    const response = await handler(req)

    // Add rate limit headers to successful responses
    response.headers.set("X-RateLimit-Limit", String(config.limit))
    response.headers.set("X-RateLimit-Remaining", String(result.remaining))
    response.headers.set("X-RateLimit-Reset", String(result.resetTime))

    return response
  }
}

/**
 * Error handling wrapper
 */
export function withErrorHandling(
  handler: (req: NextRequest) => Promise<NextResponse>,
  defaultErrorMessage: string
) {
  return async (req: NextRequest) => {
    try {
      return await handler(req)
    } catch (error) {
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
 * Combined wrapper: authentication + rate limiting + error handling
 * Use this for protected API routes
 * 
 * Note: This function wraps withAuth, so authentication happens before
 * rate limiting and error handling for better security
 */
export function withProtectedApi(
  handler: (
    req: NextRequest,
    user: { id: string; email: string; role: string }
  ) => Promise<NextResponse>,
  options: {
    defaultErrorMessage: string
    rateLimit?: RateLimitConfig
    requiredPermissions?: string[]
  }
) {
  const { defaultErrorMessage, rateLimit = RateLimitPresets.standard, requiredPermissions } = options

  // Import withAuth to wrap the handler
  // We need to import it here to avoid circular dependency issues
  return async (req: NextRequest) => {
    const { withAuth } = await import("@/lib/auth-middleware")
    const authenticatedHandler = withAuth(handler, { requiredPermissions })
    return withApiMiddleware(authenticatedHandler, { defaultErrorMessage, rateLimit })(req)
  }
}

/**
 * Combined wrapper for dynamic routes with params
 * Use this for protected API routes with [id] or similar dynamic segments
 */
export function withProtectedApiParams<T extends Record<string, string>>(
  handler: (
    req: NextRequest,
    user: { id: string; email: string; role: string },
    params: Promise<T>
  ) => Promise<NextResponse>,
  options: {
    defaultErrorMessage: string
    rateLimit?: RateLimitConfig
    requiredPermissions?: string[]
  }
) {
  const { defaultErrorMessage, rateLimit = RateLimitPresets.standard, requiredPermissions } = options

  return async (req: NextRequest, context: { params: Promise<T> }) => {
    const { withAuth } = await import("@/lib/auth-middleware")
    const authenticatedHandler = withAuth(
      async (req: NextRequest, user: { id: string; email: string; role: string }) => {
        return handler(req, user, context.params)
      },
      { requiredPermissions }
    )
    return withApiMiddleware(authenticatedHandler, { defaultErrorMessage, rateLimit })(req)
  }
}

/**
 * Get client IP from request
 */
export function getRequestIp(req: NextRequest): string {
  return getClientIp(req as unknown as Request)
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
    return createErrorResponse(
      new Error(`Method ${req.method} not allowed`),
      `Bu endpoint sadece ${allowedMethods.join(", ")} metodlarını destekler`,
      405
    )
  }
  return null
}
