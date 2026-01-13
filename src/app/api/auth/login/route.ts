import { NextRequest, NextResponse } from "next/server"
import { getSupabaseClient } from "@/lib/supabase/client"
import { loginSchema } from "@/lib/validations/auth"
import {
  withApiMiddleware,
  createErrorResponse,
  RateLimitPresets,
} from "@/lib/api-helpers"

async function handleLogin(req: NextRequest) {
  try {
    const body = await req.json()

    const validatedData = loginSchema.parse(body)

    const supabase = getSupabaseClient()

    const { data, error } = await supabase.auth.signInWithPassword({
      email: validatedData.email,
      password: validatedData.password,
    })

    if (error) {
      return createErrorResponse(
        error,
        "Giriş başarısız",
        401
      )
    }

    if (!data.session) {
      return createErrorResponse(
        new Error("Session not created"),
        "Oturum oluşturulamadı",
        500
      )
    }

    // SECURITY FIX: Token'ları response body'den kaldırdık
    // Token'lar sadece httpOnly cookie'lerde saklanıyor
    const response = NextResponse.json({
      user: {
        id: data.user.id,
        email: data.user.email,
      },
      // Token'lar artık response body'de değil, sadece httpOnly cookie'lerde
      // expires_at bilgisi client tarafında token expiry kontrolü için gerekli
      expires_at: data.session.expires_at,
    })

    // Access token: 24 hours expiry (JWT with 24h expiry)
    response.cookies.set("sb-access-token", data.session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    })

    // Refresh token: 30 days expiry
    response.cookies.set("sb-refresh-token", data.session.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    })

    return response
  } catch (error) {
    if (error instanceof Error) {
      return createErrorResponse(
        error,
        "Geçersiz istek",
        400
      )
    }

    return createErrorResponse(
      new Error("Unknown error"),
      "Beklenmeyen bir hata oluştu",
      500
    )
  }
}

// SECURITY FIX: Rate limiting eklendi (strict: 5 req/min)
// Bu brute-force saldırılarını önler
export const POST = withApiMiddleware(handleLogin, {
  defaultErrorMessage: "Giriş başarısız",
  rateLimit: RateLimitPresets.strict, // 5 requests per minute
})
