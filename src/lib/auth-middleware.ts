/**
 * API Authentication Utilities
 *
 * JWT token validation, role-based access control,
 * and authentication middleware for protected API routes.
 */

import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase/client";
import { createErrorResponse } from "@/lib/api-helpers";

/**
 * Authentication result interface
 */
export interface AuthResult {
  success: boolean;
  user?: {
    id: string;
    email: string;
    role: string;
  };
  error?: NextResponse;
}

/**
 * Validate JWT token from Authorization header or httpOnly cookie
 * Tokens stored in httpOnly cookies for security
 */
export async function validateAuthToken(
  request: NextRequest,
): Promise<AuthResult> {
  try {
    // Try to get token from Authorization header first
    const authHeader = request.headers.get("authorization");
    let token: string | undefined;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    } else {
      // Fallback to httpOnly cookie (sb-access-token)
      token = request.cookies.get("sb-access-token")?.value;
    }

    if (!token) {
      return {
        success: false,
        error: createErrorResponse(
          new Error("Authorization token missing"),
          "Oturum belirteci gerekli",
          401,
        ),
      };
    }
    const supabase = getSupabaseClient();

    if (!supabase) {
      return {
        success: false,
        error: createErrorResponse(
          new Error("Supabase client not available"),
          "Sunucu hatası",
          500,
        ),
      };
    }

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return {
        success: false,
        error: createErrorResponse(
          new Error("Invalid or expired token"),
          "Oturum belirteci geçersiz veya süresi dolmuş",
          401,
        ),
      };
    }

    // Fetch user role from database
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("role, email")
      .eq("id", user.id)
      .single();

    if (userError) {
      return {
        success: false,
        error: createErrorResponse(
          new Error("User data fetch failed"),
          "Kullanıcı bilgileri alınamadı",
          500,
        ),
      };
    }

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email || "",
        role: userData?.role || "uye",
      },
    };
  } catch (error) {
    return {
      success: false,
      error: createErrorResponse(error, "Oturum doğrulama başarısız", 401),
    };
  }
}

/**
 * Role-based access control
 */
export function checkPermissions(
  userRole: string,
  requiredPermissions: string[],
): boolean {
  // Define role permissions
  const rolePermissions: Record<string, string[]> = {
    admin: [
      "donations.view",
      "donations.create",
      "donations.edit",
      "donations.delete",
      "members.view",
      "members.create",
      "members.edit",
      "members.delete",
      "social-aid.view",
      "social-aid.create",
      "social-aid.edit",
      "social-aid.approve",
      "documents.view",
      "documents.create",
      "documents.delete",
      "reports.export",
      "settings.manage",
      "users.view",
      "users.create",
      "users.edit",
      "users.delete",
    ],
    muhasebe: [
      "donations.view",
      "donations.create",
      "donations.edit",
      "members.view",
      "reports.export",
      "documents.view",
    ],
    gorevli: [
      "donations.view",
      "donations.create",
      "members.view",
      "members.create",
      "social-aid.view",
      "social-aid.create",
      "documents.view",
      "documents.create",
    ],
    uye: [
      "donations.view",
      "members.view",
      "social-aid.view",
      "documents.view",
    ],
  };

  const userPermissions = rolePermissions[userRole] || [];

  return requiredPermissions.every((permission) =>
    userPermissions.includes(permission),
  );
}

/**
 * Authentication middleware wrapper
 */
export function withAuth(
  handler: (
    req: NextRequest,
    user: { id: string; email: string; role: string },
  ) => Promise<NextResponse>,
  options?: {
    requiredPermissions?: string[];
  },
) {
  return async (req: NextRequest) => {
    const authResult = await validateAuthToken(req);

    if (!authResult.success || !authResult.user) {
      return authResult.error!;
    }

    // Check permissions if required
    if (options?.requiredPermissions) {
      const hasPermission = checkPermissions(
        authResult.user.role,
        options.requiredPermissions,
      );

      if (!hasPermission) {
        return createErrorResponse(
          new Error("Insufficient permissions"),
          "Bu işlem için yetkiniz yok",
          403,
        );
      }
    }

    return handler(req, authResult.user);
  };
}

/**
 * Public routes (no authentication required)
 */
export const PUBLIC_ROUTES = [
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/logout",
  "/api/auth/refresh",
];

/**
 * Check if route is public
 */
export function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
}
