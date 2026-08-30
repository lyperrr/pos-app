import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Sanitizes raw technical/SQL error messages into a user-friendly Bahasa Indonesia message.
 */
export function sanitizeErrorMessage(
  message?: string | null,
  fallback = "Gagal terhubung ke server atau database. Silakan coba beberapa saat lagi."
): string {
  if (!message || typeof message !== "string") return fallback

  const isTechnicalError =
    /SQLSTATE|Connection refused|PDOException|QueryException|Syntax error|Fatal error|Column not found|Table .* doesn't exist|select \* from|insert into|update .* set|delete from|personal_access_tokens|db_pos_nira/i.test(
      message
    )

  if (isTechnicalError) {
    return fallback
  }

  return message
}
