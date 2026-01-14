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
 * @throws {Error} If email sending fails
 */
export async function sendPasswordResetEmail(
  email: string,
  redirectTo?: string,
): Promise<{ success: true }> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo:
        redirectTo || `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
    });

    if (error) {
      console.error("Password reset email error:", error);
      throw new Error(`Password reset email failed: ${error.message}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to send password reset email:", error);
    // Ensure error is always an Error instance to prevent unhandled rejections
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to send password reset email: Unknown error");
  }
}

/**
 * Send email verification
 * @throws {Error} If email sending fails
 */
export async function sendVerificationEmail(
  email: string,
): Promise<{ success: true }> {
  try {
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
    });

    if (error) {
      console.error("Verification email error:", error);
      throw new Error(`Verification email failed: ${error.message}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to send verification email:", error);
    // Ensure error is always an Error instance to prevent unhandled rejections
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to send verification email: Unknown error");
  }
}

/**
 * Send magic link email
 * @throws {Error} If email sending fails
 */
export async function sendMagicLinkEmail(
  email: string,
  redirectTo?: string,
): Promise<{ success: true }> {
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
      throw new Error(`Magic link email failed: ${error.message}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to send magic link email:", error);
    // Ensure error is always an Error instance to prevent unhandled rejections
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to send magic link email: Unknown error");
  }
}

/**
 * Send email change confirmation
 * @throws {Error} If email sending fails
 */
export async function sendEmailChangeConfirmation(
  _user: User,
  newEmail: string,
): Promise<{ success: true }> {
  try {
    const { error } = await supabase.auth.updateUser(
      { email: newEmail },
      {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      },
    );

    if (error) {
      console.error("Email change confirmation error:", error);
      throw new Error(`Email change confirmation failed: ${error.message}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to send email change confirmation:", error);
    // Ensure error is always an Error instance to prevent unhandled rejections
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to send email change confirmation: Unknown error");
  }
}

/**
 * Check if email service is configured
 */
export async function checkEmailServiceStatus(): Promise<{
  configured: boolean
  error?: string
}> {
  try {
    // Try to get auth settings to check if email is configured
    const { error } = await supabase.auth.getSession()

    if (error) {
      return {
        configured: false,
        error: error.message,
      }
    }

    return {
      configured: true,
    }
  } catch (error) {
    return {
      configured: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
