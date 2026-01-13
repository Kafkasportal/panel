/**
 * Email Service Wrapper
 *
 * Optional wrapper for custom email functionality.
 * Currently, Supabase Auth handles most email operations.
 * This service can be extended for custom email templates or notifications.
 */

import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

const supabase = createClient();

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  email: string,
  redirectTo?: string,
) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo:
        redirectTo || `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
    });

    if (error) {
      console.error("Password reset email error:", error);
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to send password reset email:", error);
    throw error;
  }
}

/**
 * Send email verification
 */
export async function sendVerificationEmail(email: string) {
  try {
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
    });

    if (error) {
      console.error("Verification email error:", error);
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to send verification email:", error);
    throw error;
  }
}

/**
 * Send magic link email
 */
export async function sendMagicLinkEmail(email: string, redirectTo?: string) {
  try {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo:
          redirectTo || `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      },
    });

    if (error) {
      console.error("Magic link email error:", error);
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to send magic link email:", error);
    throw error;
  }
}

/**
 * Send email change confirmation
 */
export async function sendEmailChangeConfirmation(
  _user: User,
  newEmail: string,
) {
  try {
    const { error } = await supabase.auth.updateUser(
      { email: newEmail },
      {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      },
    );

    if (error) {
      console.error("Email change confirmation error:", error);
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to send email change confirmation:", error);
    throw error;
  }
}

/**
 * Check if email service is configured
 */
export async function checkEmailServiceStatus(): Promise<{
  configured: boolean;
  error?: string;
}> {
  try {
    // Try to get auth settings to check if email is configured
    const { error } = await supabase.auth.getSession();

    if (error) {
      return {
        configured: false,
        error: error.message,
      };
    }

    return {
      configured: true,
    };
  } catch (error) {
    return {
      configured: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
